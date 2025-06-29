import { type NextRequest, NextResponse } from "next/server"
import { activeSessions } from "../connect/route"
import { addMessageToQueue } from "../poll/route"

// Armazenamento em memória das listas (em produção, usar banco de dados)
const callLists = new Map<string, any>()

export async function GET() {
  try {
    const lists = Array.from(callLists.values())
    return NextResponse.json({ lists })
  } catch (error) {
    console.error("❌ Erro ao buscar listas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    console.log("📋 Lista API - Ação:", action)

    switch (action) {
      case "create":
        return await createList(body.data)

      case "send_to_devices":
        return await sendListToDevices(body.list_id)

      case "update_status":
        return await updateListStatus(body.list_id, body.status)

      case "delete":
        return await deleteList(body.list_id)

      default:
        return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Erro na API de listas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

async function createList(data: any) {
  try {
    const listId = `list_${Date.now()}_${Math.random().toString(36).substring(2)}`

    // Criar grupos de conferência (máximo 6 números por grupo)
    const conferenceGroups = []
    const maxParticipants = 6

    for (let i = 0; i < data.numbers.length; i += maxParticipants) {
      const groupNumbers = data.numbers.slice(i, i + maxParticipants)
      conferenceGroups.push({
        groupId: `group_${i / maxParticipants + 1}`,
        numbers: groupNumbers,
        startIndex: i,
        endIndex: Math.min(i + maxParticipants - 1, data.numbers.length - 1),
      })
    }

    const newList = {
      id: listId,
      name: data.name,
      numbers: data.numbers,
      originalNumbers: data.originalNumbers || data.numbers,
      ddd: data.ddd,
      status: "paused",
      progress: 0,
      totalNumbers: data.numbers.length,
      completedCalls: 0,
      currentGroup: 0,
      conferenceGroups,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    callLists.set(listId, newList)

    console.log("✅ Lista criada:", {
      id: listId,
      name: data.name,
      totalNumbers: data.numbers.length,
      groups: conferenceGroups.length,
    })

    return NextResponse.json({
      success: true,
      message: `Lista "${data.name}" criada com ${data.numbers.length} números em ${conferenceGroups.length} grupos`,
      listId,
    })
  } catch (error) {
    console.error("❌ Erro ao criar lista:", error)
    return NextResponse.json({ error: "Erro ao criar lista" }, { status: 500 })
  }
}

async function sendListToDevices(listId: string) {
  try {
    const list = callLists.get(listId)
    if (!list) {
      return NextResponse.json({ error: "Lista não encontrada" }, { status: 404 })
    }

    // Buscar dispositivos conectados
    const connectedDevices = Array.from(activeSessions.values()).filter(
      (session) => session.status === "connected" && Date.now() - session.lastSeen < 60000, // 1 minuto
    )

    if (connectedDevices.length === 0) {
      return NextResponse.json({ error: "Nenhum dispositivo conectado" }, { status: 400 })
    }

    // Preparar dados da conferência para envio
    const conferenceData = {
      list_id: listId,
      list_name: list.name,
      total_numbers: list.totalNumbers,
      numbers: list.numbers,
      ddd: list.ddd,
      max_participants: 6,
      call_sequence: "random", // Chamadas aleatórias
      conference_duration: 300, // 5 minutos por conferência
      interval_between_calls: 3000, // 3 segundos entre chamadas
      auto_restart: true, // Reiniciar quando terminar a lista
      groups: list.conferenceGroups,
    }

    // Enviar para todos os dispositivos conectados
    let sentCount = 0
    for (const device of connectedDevices) {
      try {
        addMessageToQueue(device.sessionId, "conference_call_list", {
          action: "START_CONFERENCE",
          conference_data: conferenceData,
          timestamp: Date.now(),
        })
        sentCount++
        console.log("📤 Lista enviada para dispositivo:", device.sessionId)
      } catch (error) {
        console.error("❌ Erro ao enviar para dispositivo:", device.sessionId, error)
      }
    }

    // Atualizar status da lista
    list.status = "active"
    list.updatedAt = new Date().toISOString()
    callLists.set(listId, list)

    console.log("🎯 Lista de conferência enviada:", {
      listId,
      listName: list.name,
      devicesCount: sentCount,
      totalNumbers: list.totalNumbers,
    })

    return NextResponse.json({
      success: true,
      message: `Lista "${list.name}" enviada para ${sentCount} dispositivo(s)`,
      devicesCount: sentCount,
    })
  } catch (error) {
    console.error("❌ Erro ao enviar lista:", error)
    return NextResponse.json({ error: "Erro ao enviar lista" }, { status: 500 })
  }
}

async function updateListStatus(listId: string, status: string) {
  try {
    const list = callLists.get(listId)
    if (!list) {
      return NextResponse.json({ error: "Lista não encontrada" }, { status: 404 })
    }

    list.status = status
    list.updatedAt = new Date().toISOString()
    callLists.set(listId, list)

    // Se pausando ou parando, enviar comando para dispositivos
    if (status === "paused" || status === "completed") {
      const connectedDevices = Array.from(activeSessions.values()).filter((session) => session.status === "connected")

      for (const device of connectedDevices) {
        addMessageToQueue(device.sessionId, "stop_conference", {
          action: "STOP_CONFERENCE",
          list_id: listId,
          reason: status === "paused" ? "paused_by_user" : "completed_by_user",
        })
      }
    }

    console.log("📊 Status da lista atualizado:", { listId, status })

    return NextResponse.json({
      success: true,
      message: `Status da lista atualizado para: ${status}`,
    })
  } catch (error) {
    console.error("❌ Erro ao atualizar status:", error)
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
  }
}

async function deleteList(listId: string) {
  try {
    const list = callLists.get(listId)
    if (!list) {
      return NextResponse.json({ error: "Lista não encontrada" }, { status: 404 })
    }

    // Parar conferência se estiver ativa
    if (list.status === "active") {
      const connectedDevices = Array.from(activeSessions.values()).filter((session) => session.status === "connected")

      for (const device of connectedDevices) {
        addMessageToQueue(device.sessionId, "stop_conference", {
          action: "STOP_CONFERENCE",
          list_id: listId,
          reason: "list_deleted",
        })
      }
    }

    callLists.delete(listId)

    console.log("🗑️ Lista removida:", { listId, name: list.name })

    return NextResponse.json({
      success: true,
      message: `Lista "${list.name}" removida com sucesso`,
    })
  } catch (error) {
    console.error("❌ Erro ao remover lista:", error)
    return NextResponse.json({ error: "Erro ao remover lista" }, { status: 500 })
  }
}
