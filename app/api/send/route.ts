import { type NextRequest, NextResponse } from "next/server"
import { messageQueue } from "@/lib/message-queue"
import { deviceManager } from "@/lib/device-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, type, data } = body

    if (!sessionId || !type) {
      return NextResponse.json({ success: false, error: "Session ID and message type required" }, { status: 400 })
    }

    // Check if device exists
    const device = deviceManager.getDevice(sessionId)
    if (!device) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
    }

    // Add message to queue
    const messageId = messageQueue.addMessage(sessionId, type, data)

    console.log(`Message queued for device ${sessionId}: ${type}`)

    return NextResponse.json({
      success: true,
      messageId: messageId,
      message: "Message queued successfully",
    })
  } catch (error) {
    console.error("Error in send API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
