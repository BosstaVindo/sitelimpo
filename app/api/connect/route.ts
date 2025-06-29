import { type NextRequest, NextResponse } from "next/server"
import { deviceManager } from "@/lib/device-manager"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, deviceName } = body

    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Device ID é obrigatório" }, { status: 400 })
    }

    // Registra o dispositivo
    deviceManager.registerDevice(deviceId, deviceName || `Device ${deviceId}`)

    return NextResponse.json({
      success: true,
      message: "Dispositivo conectado com sucesso",
      deviceId,
      serverTime: Date.now(),
    })
  } catch (error) {
    console.error("Erro ao conectar dispositivo:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")

    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Device ID é obrigatório" }, { status: 400 })
    }

    const device = deviceManager.getDevice(deviceId)

    if (!device) {
      return NextResponse.json({ success: false, error: "Dispositivo não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      device,
      serverTime: Date.now(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
