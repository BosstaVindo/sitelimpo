"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Send, Trash2, Phone } from "lucide-react"

interface CallList {
  id: string
  name: string
  numbers: string[]
  createdAt: string
  status: "active" | "completed" | "paused"
}

export function CallListManager() {
  const [lists, setLists] = useState<CallList[]>([])
  const [newListName, setNewListName] = useState("")
  const [newListNumbers, setNewListNumbers] = useState("")
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const createList = async () => {
    if (!newListName.trim() || !newListNumbers.trim()) return

    const numbers = newListNumbers
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    const newList: CallList = {
      id: Date.now().toString(),
      name: newListName,
      numbers,
      createdAt: new Date().toISOString(),
      status: "active",
    }

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      })

      if (response.ok) {
        setLists([...lists, newList])
        setNewListName("")
        setNewListNumbers("")
      }
    } catch (error) {
      console.error("Erro ao criar lista:", error)
    }
  }

  const sendListToDevices = async (listId: string) => {
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          deviceIds: selectedDevices,
        }),
      })

      if (response.ok) {
        console.log("Lista enviada com sucesso")
      }
    } catch (error) {
      console.error("Erro ao enviar lista:", error)
    }
  }

  const deleteList = (listId: string) => {
    setLists(lists.filter((list) => list.id !== listId))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Lista de Chamadas
          </CardTitle>
          <CardDescription>Crie uma nova lista com números para discagem automática</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">Nome da Lista</Label>
            <Input
              id="list-name"
              placeholder="Ex: Campanha Janeiro 2024"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numbers">Números (um por linha)</Label>
            <Textarea
              id="numbers"
              placeholder="11999999999&#10;11888888888&#10;11777777777"
              rows={6}
              value={newListNumbers}
              onChange={(e) => setNewListNumbers(e.target.value)}
            />
          </div>

          <Button onClick={createList} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Lista
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Listas Criadas</h3>

        {lists.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Phone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma lista criada ainda</p>
            </CardContent>
          </Card>
        ) : (
          lists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    <CardDescription>
                      {list.numbers.length} números • Criada em {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      list.status === "active" ? "default" : list.status === "completed" ? "secondary" : "outline"
                    }
                  >
                    {list.status === "active" ? "Ativa" : list.status === "completed" ? "Concluída" : "Pausada"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Números:</Label>
                    <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-sm">
                      {list.numbers.join(", ")}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button onClick={() => sendListToDevices(list.id)} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar para Dispositivos
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => deleteList(list.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
