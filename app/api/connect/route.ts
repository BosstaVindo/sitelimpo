import { type NextRequest, NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"

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
    const { deviceType = "android" } = body

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Add device to manager
    const device = deviceManager.addDevice(sessionId, deviceType)

    console.log(`New device connected: ${sessionId}`)

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      message: "Device connected successfully",
      device: device,
    })
  } catch (error) {
    console.error("Error connecting device:", error)
    return NextResponse.json({ success: false, error: "Failed to connect device" }, { status: 500 })
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
