import { type NextRequest, NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"

export async function GET() {
  try {
    const devices = deviceManager.getAllDevices()
    const stats = deviceManager.getDeviceStats()

    return NextResponse.json({
      success: true,
      devices: devices,
      stats: stats,
    })
  } catch (error) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch devices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sessionId } = body

    switch (action) {
      case "remove": {
        const success = deviceManager.removeDevice(sessionId)

        if (!success) {
          return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Device removed successfully",
        })
      }

      case "update": {
        const { updates } = body
        const success = deviceManager.updateDevice(sessionId, updates)

        if (!success) {
          return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Device updated successfully",
        })
      }

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in devices API:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
