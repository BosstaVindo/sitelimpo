import { type NextRequest, NextResponse } from "next/server"
import { addMessageToQueue } from "../poll/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionId = request.nextUrl.searchParams.get("session")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID é obrigatório" }, { status: 400 })
    }

    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Tipo e dados são obrigatórios" }, { status: 400 })
    }

    // Adicionar mensagem à fila do dispositivo
    addMessageToQueue(sessionId, type, data)

    console.log("📤 Mensagem enviada para dispositivo:", {
      sessionId,
      type,
      dataKeys: Object.keys(data),
    })

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso",
      sessionId,
      type,
    })
  } catch (error) {
    console.error("❌ Erro no endpoint /send:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
