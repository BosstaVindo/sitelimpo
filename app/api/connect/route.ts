import { type NextRequest, NextResponse } from "next/server"

// Armazenamento em memória das sessões ativas
export const activeSessions = new Map<
  string,
  {
    sessionId: string
    deviceType: string
    status: string
    connectedAt: number
    lastSeen: number
    userAgent?: string
  }
>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionId = request.nextUrl.searchParams.get("session") || body.sessionId

    console.log("🔌 CONNECT Request:", {
      sessionId,
      action: body.action,
      deviceType: body.deviceType,
      timestamp: new Date().toISOString(),
    })

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
    }

    if (body.action === "DEVICE_CONNECT") {
      // Registrar nova sessão
      const session = {
        sessionId,
        deviceType: body.deviceType || "unknown",
        status: "connected",
        connectedAt: Date.now(),
        lastSeen: Date.now(),
        userAgent: request.headers.get("user-agent") || undefined,
      }

      activeSessions.set(sessionId, session)

      console.log("✅ Dispositivo conectado:", {
        sessionId,
        deviceType: session.deviceType,
        userAgent: session.userAgent,
      })

      return NextResponse.json({
        status: "connected",
        sessionId,
        serverTime: Date.now(),
        message: "Dispositivo conectado com sucesso",
        config: {
          pollingInterval: 3000,
          heartbeatInterval: 15000,
          maxRetries: 10,
        },
      })
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
  } catch (error) {
    console.error("❌ Erro no endpoint /connect:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
  }

  const session = activeSessions.get(sessionId)
  if (!session) {
    return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 })
  }

  return NextResponse.json({
    sessionId,
    status: session.status,
    connectedAt: session.connectedAt,
    lastSeen: session.lastSeen,
    uptime: Date.now() - session.connectedAt,
  })
}
