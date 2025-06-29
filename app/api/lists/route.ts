import { type NextRequest, NextResponse } from "next/server"

// Simulação de armazenamento em memória (em produção, usar banco de dados)
let lists: any[] = []

export async function GET() {
  return NextResponse.json({ lists })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newList = {
      id: body.id || Date.now().toString(),
      name: body.name,
      numbers: body.numbers,
      createdAt: body.createdAt || new Date().toISOString(),
      status: body.status || "active",
    }

    lists.push(newList)

    return NextResponse.json({
      success: true,
      list: newList,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao criar lista" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listId = searchParams.get("id")

    if (!listId) {
      return NextResponse.json({ success: false, error: "ID da lista é obrigatório" }, { status: 400 })
    }

    lists = lists.filter((list) => list.id !== listId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao deletar lista" }, { status: 500 })
  }
}
