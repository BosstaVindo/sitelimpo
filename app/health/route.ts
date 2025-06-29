import { NextResponse } from "next/server"
import { activeSessions } from "../api/connect/route"

export async function GET() {
  try {
    const now = Date.now()
    const connectedDevices = Array.from(activeSessions.values()).filter(
      (session) => session.status === "connected" && now - session.lastSeen < 60000,
    )

    return NextResponse.json({
      status: "healthy",
      timestamp: now,
      uptime: process.uptime(),
      connectedDevices: connectedDevices.length,
      totalSessions: activeSessions.size,
      version: "2.1.0",
    })
  } catch (error) {
    console.error("❌ Erro no health check:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
