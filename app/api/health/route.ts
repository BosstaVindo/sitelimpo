import { NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"

export async function GET() {
  try {
    const devices = deviceManager.getAllDevices()
    const connectedDevices = devices.filter((d) => d.status !== "offline").length
    const activeConnections = devices.filter((d) => d.status === "busy").length

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      connectedDevices,
      activeConnections,
      totalDevices: devices.length,
      version: "2.1.0",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
