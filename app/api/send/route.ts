import { type NextRequest, NextResponse } from "next/server"
import { messageQueue } from "@/lib/message-queue"
import { deviceManager } from "@/lib/device-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listId, deviceIds, listData } = body

    if (!listId) {
      return NextResponse.json({ success: false, error: "List ID é obrigatório" }, { status: 400 })
    }

    // Se não especificar dispositivos, envia para todos os dispositivos online
    let targetDevices = deviceIds
    if (!targetDevices || targetDevices.length === 0) {
      const allDevices = deviceManager.getAllDevices()
      targetDevices = allDevices.filter((device) => device.status === "online").map((device) => device.id)
    }

    if (targetDevices.length === 0) {
      return NextResponse.json({ success: false, error: "Nenhum dispositivo disponível" }, { status: 400 })
    }

    // Envia a lista para cada dispositivo
    targetDevices.forEach((deviceId: string) => {
      messageQueue.addMessage(deviceId, {
        deviceId,
        type: "call_list",
        data: {
          listId,
          listData: listData || {
            id: listId,
            name: `Lista ${listId}`,
            numbers: [],
            createdAt: new Date().toISOString(),
          },
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: `Lista enviada para ${targetDevices.length} dispositivo(s)`,
      sentTo: targetDevices,
    })
  } catch (error) {
    console.error("Erro ao enviar lista:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Retorna estatísticas de envio
    const devices = deviceManager.getAllDevices()
    const onlineDevices = devices.filter((d) => d.status === "online").length
    const busyDevices = devices.filter((d) => d.status === "busy").length

    return NextResponse.json({
      success: true,
      stats: {
        totalDevices: devices.length,
        onlineDevices,
        busyDevices,
        availableDevices: onlineDevices,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
