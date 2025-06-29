import { NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"

export async function GET() {
  try {
    const devices = deviceManager.getAllDevices()

    return NextResponse.json({
      success: true,
      devices,
      count: devices.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar dispositivos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { deviceId, deviceName, action } = body

    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Device ID é obrigatório" }, { status: 400 })
    }

    switch (action) {
      case "register":
        deviceManager.registerDevice(deviceId, deviceName || `Device ${deviceId}`)
        break
      case "update_status":
        deviceManager.updateDeviceStatus(deviceId, body.status)
        break
      case "ping":
        deviceManager.updateLastSeen(deviceId)
        break
      default:
        return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao processar requisição" }, { status: 500 })
  }
}
