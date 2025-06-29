import { type NextRequest, NextResponse } from "next/server"
import { messageQueue } from "@/lib/message-queue"
import { deviceManager } from "@/lib/device-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")

    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Device ID é obrigatório" }, { status: 400 })
    }

    // Atualiza o último acesso do dispositivo
    deviceManager.updateLastSeen(deviceId)

    // Busca mensagens pendentes
    const messages = messageQueue.getMessages(deviceId)

    return NextResponse.json({
      success: true,
      messages,
      hasMessages: messages.length > 0,
      serverTime: Date.now(),
    })
  } catch (error) {
    console.error("Erro no polling:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, status, callsInProgress, currentList } = body

    if (!deviceId) {
      return NextResponse.json({ success: false, error: "Device ID é obrigatório" }, { status: 400 })
    }

    // Atualiza status do dispositivo
    if (status) {
      deviceManager.updateDeviceStatus(deviceId, status)
    }

    // Atualiza informações adicionais do dispositivo
    const device = deviceManager.getDevice(deviceId)
    if (device) {
      if (typeof callsInProgress === "number") {
        device.callsInProgress = callsInProgress
      }
      if (currentList) {
        device.currentList = currentList
      }
    }

    deviceManager.updateLastSeen(deviceId)

    return NextResponse.json({
      success: true,
      serverTime: Date.now(),
    })
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
