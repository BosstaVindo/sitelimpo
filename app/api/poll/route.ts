import { type NextRequest, NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"
import { messageQueue } from "@/lib/message-queue"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 })
    }

    // Update device last seen
    deviceManager.updateLastSeen(sessionId)

    // Get messages for this device
    const messages = messageQueue.getMessages(sessionId)

    return NextResponse.json({
      success: true,
      messages: messages,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in poll API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
