import { type NextRequest, NextResponse } from "next/server"
import { activeSessions } from "../connect/route"

// Fila de mensagens para cada sessão
const messageQueues = new Map<string, any[]>()

export function addMessageToQueue(sessionId: string, type: string, data: any) {
  if (!messageQueues.has(sessionId)) {
    messageQueues.set(sessionId, [])
  }

  const queue = messageQueues.get(sessionId)!
  queue.push({
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    type,
    data,
    timestamp: Date.now(),
  })

  console.log(`📨 Mensagem adicionada à fila [${sessionId}]:`, { type, dataKeys: Object.keys(data) })
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
    }

    // Atualizar último acesso da sessão
    const session = activeSessions.get(sessionId)
    if (session) {
      session.lastSeen = Date.now()
      activeSessions.set(sessionId, session)
    }

    // Buscar mensagens na fila
    const queue = messageQueues.get(sessionId) || []
    const messages = [...queue] // Cópia das mensagens

    // Limpar fila após enviar mensagens
    messageQueues.set(sessionId, [])

    if (messages.length > 0) {
      console.log(`📤 Enviando ${messages.length} mensagem(ns) para [${sessionId}]`)
    }

    return NextResponse.json({
      sessionId,
      messages,
      timestamp: Date.now(),
      hasMessages: messages.length > 0,
    })
  } catch (error) {
    console.error("❌ Erro no endpoint /poll:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionId = request.nextUrl.searchParams.get("session") || body.sessionId

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
    }

    console.log("📨 Mensagem recebida do dispositivo:", {
      sessionId,
      action: body.action,
      type: body.type,
    })

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("❌ Erro no endpoint /poll POST:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
