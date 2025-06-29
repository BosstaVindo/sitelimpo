import { type NextRequest, NextResponse } from "next/server"

interface CallList {
  id: string
  name: string
  numbers: string[]
  originalNumbers: string[]
  ddd?: string
  status: "paused" | "active" | "completed"
  progress: number
  totalNumbers: number
  completedCalls: number
  currentGroup: number
  conferenceGroups: Array<{
    groupId: string
    numbers: string[]
    startIndex: number
    endIndex: number
  }>
  createdAt: string
  updatedAt: string
}

// In-memory storage (replace with database in production)
const lists: CallList[] = []

function createConferenceGroups(numbers: string[]): Array<{
  groupId: string
  numbers: string[]
  startIndex: number
  endIndex: number
}> {
  const groups = []
  const groupSize = 6 // Maximum 6 numbers per conference

  for (let i = 0; i < numbers.length; i += groupSize) {
    const groupNumbers = numbers.slice(i, i + groupSize)
    groups.push({
      groupId: `group_${Date.now()}_${i}`,
      numbers: groupNumbers,
      startIndex: i,
      endIndex: Math.min(i + groupSize - 1, numbers.length - 1),
    })
  }

  return groups
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      lists: lists,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch lists" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "create": {
        const { data } = body
        const newList: CallList = {
          id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          numbers: data.numbers,
          originalNumbers: data.originalNumbers,
          ddd: data.ddd,
          status: "paused",
          progress: 0,
          totalNumbers: data.numbers.length,
          completedCalls: 0,
          currentGroup: 0,
          conferenceGroups: createConferenceGroups(data.numbers),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        lists.push(newList)

        return NextResponse.json({
          success: true,
          message: `Lista "${data.name}" criada com ${data.numbers.length} números`,
          list: newList,
        })
      }

      case "send_to_devices": {
        const { list_id } = body
        const list = lists.find((l) => l.id === list_id)

        if (!list) {
          return NextResponse.json({ success: false, error: "Lista não encontrada" }, { status: 404 })
        }

        // Update list status to active
        list.status = "active"
        list.updatedAt = new Date().toISOString()

        // Here you would send the list to connected devices
        // For now, we'll just simulate it
        console.log(`Sending list ${list.name} to devices`)

        return NextResponse.json({
          success: true,
          message: `Lista "${list.name}" enviada para dispositivos conectados`,
        })
      }

      case "update_status": {
        const { list_id, status } = body
        const list = lists.find((l) => l.id === list_id)

        if (!list) {
          return NextResponse.json({ success: false, error: "Lista não encontrada" }, { status: 404 })
        }

        list.status = status
        list.updatedAt = new Date().toISOString()

        return NextResponse.json({
          success: true,
          message: `Status da lista atualizado para ${status}`,
        })
      }

      case "delete": {
        const { list_id } = body
        const index = lists.findIndex((l) => l.id === list_id)

        if (index === -1) {
          return NextResponse.json({ success: false, error: "Lista não encontrada" }, { status: 404 })
        }

        const deletedList = lists.splice(index, 1)[0]

        return NextResponse.json({
          success: true,
          message: `Lista "${deletedList.name}" removida com sucesso`,
        })
      }

      default:
        return NextResponse.json({ success: false, error: "Ação não reconhecida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in lists API:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
