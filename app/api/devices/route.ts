import { NextResponse } from "next/server"
import { activeSessions } from "../connect/route"

export async function GET() {
  try {
    const now = Date.now()
    const devices = Array.from(activeSessions.entries()).map(([sessionId, session]) => {
      const timeSinceLastSeen = now - session.lastSeen
      const isConnected = timeSinceLastSeen < 60000 // Considera conectado se visto nos últimos 60 segundos

      return {
        sessionId,
        deviceType: session.deviceType || "unknown",
        status: session.status,
        lastSeen: session.lastSeen,
        lastSeenFormatted: new Date(session.lastSeen).toLocaleString(),
        timeSinceLastSeen,
        isConnected,
        uptime: session.connectedAt ? now - session.connectedAt : 0,
        userAgent: session.userAgent || "Unknown",
      }
    })

    // Ordenar por último acesso (mais recente primeiro)
    devices.sort((a, b) => b.lastSeen - a.lastSeen)

    console.log("📱 Dispositivos ativos:", {
      total: devices.length,
      connected: devices.filter((d) => d.isConnected).length,
    })

    return NextResponse.json({
      devices,
      summary: {
        total: devices.length,
        connected: devices.filter((d) => d.isConnected).length,
        disconnected: devices.filter((d) => !d.isConnected).length,
      },
    })
  } catch (error) {
    console.error("❌ Erro ao buscar dispositivos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, device_id } = body

    switch (action) {
      case "remove":
        if (activeSessions.has(device_id)) {
          activeSessions.delete(device_id)
          return NextResponse.json({ success: true, message: "Dispositivo removido" })
        }
        return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })

      case "remove_disconnected":
        const now = Date.now()
        let removedCount = 0

        for (const [sessionId, session] of activeSessions.entries()) {
          if (now - session.lastSeen > 60000) {
            // Mais de 1 minuto sem atividade
            activeSessions.delete(sessionId)
            removedCount++
          }
        }

        return NextResponse.json({
          success: true,
          message: `${removedCount} dispositivos desconectados removidos`,
          removed_count: removedCount,
        })

      default:
        return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
    }
  } catch (error) {
    console.error("❌ Erro ao processar ação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
