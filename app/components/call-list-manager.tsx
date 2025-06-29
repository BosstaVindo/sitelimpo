"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Send, Trash2, Users, Phone, Play, Pause, Square, Save, X, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

interface Device {
  sessionId: string
  deviceType: string
  status: string
  lastSeen: number
  isConnected: boolean
}

export default function CallListManager() {
  const [lists, setLists] = useState<CallList[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newList, setNewList] = useState({
    name: "",
    numbers: "",
    ddd: "",
  })

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists")
      if (response.ok) {
        const data = await response.json()
        setLists(data.lists || [])
      }
    } catch (error) {
      console.error("Error fetching lists:", error)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices")
      if (response.ok) {
        const data = await response.json()
        setDevices(data.devices || [])
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
    }
  }

  const validateNumbers = (numbersText: string) => {
    const lines = numbersText.split("\n").filter((line) => line.trim())
    const validNumbers: string[] = []
    const invalidNumbers: string[] = []

    for (const line of lines) {
      const number = line.trim().replace(/\D/g, "")
      if (number.length >= 8) {
        validNumbers.push(number)
      } else {
        invalidNumbers.push(line.trim())
      }
    }

    return { validNumbers, invalidNumbers }
  }

  const createList = async () => {
    if (!newList.name.trim() || !newList.numbers.trim()) {
      toast({
        title: "Erro",
        description: "Nome e números são obrigatórios",
        variant: "destructive",
      })
      return
    }

    const { validNumbers, invalidNumbers } = validateNumbers(newList.numbers)

    if (validNumbers.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum número válido encontrado",
        variant: "destructive",
      })
      return
    }

    if (invalidNumbers.length > 0) {
      toast({
        title: "Aviso",
        description: `${invalidNumbers.length} números inválidos foram ignorados`,
        variant: "destructive",
      })
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          data: {
            name: newList.name.trim(),
            numbers: validNumbers,
            originalNumbers: newList.numbers.split("\n").filter((line) => line.trim()),
            ddd: newList.ddd.trim() || undefined,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Sucesso",
          description: data.message,
        })
        setNewList({ name: "", numbers: "", ddd: "" })
        setIsCreating(false)
        fetchLists()
      } else {
        throw new Error("Failed to create list")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar lista",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendListToDevices = async (listId: string) => {
    const connectedDevices = devices.filter((d) => d.isConnected)

    if (connectedDevices.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum dispositivo conectado",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send_to_devices",
          list_id: listId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Sucesso",
          description: data.message,
        })
        fetchLists()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send list")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao enviar lista",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateListStatus = async (listId: string, status: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_status",
          list_id: listId,
          status: status,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Status atualizado",
        })
        fetchLists()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteList = async (listId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          list_id: listId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Lista removida",
        })
        fetchLists()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover lista",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLists()
    fetchDevices()
    const interval = setInterval(() => {
      fetchLists()
      fetchDevices()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "completed":
        return <Square className="h-4 w-4" />
      default:
        return <Pause className="h-4 w-4" />
    }
  }

  const connectedDevicesCount = devices.filter((d) => d.isConnected).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Listas de Chamadas</h2>
          <p className="text-sm text-muted-foreground">{connectedDevicesCount} dispositivo(s) conectado(s)</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Lista
        </Button>
      </div>

      {/* Formulário de Criação */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Lista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="listName">Nome da Lista</Label>
                <Input
                  id="listName"
                  value={newList.name}
                  onChange={(e) => setNewList((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Lista Manhã"
                />
              </div>
              <div>
                <Label htmlFor="ddd">DDD (Opcional)</Label>
                <Input
                  id="ddd"
                  value={newList.ddd}
                  onChange={(e) => setNewList((prev) => ({ ...prev, ddd: e.target.value }))}
                  placeholder="Ex: 11"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="numbers">Números (um por linha)</Label>
              <Textarea
                id="numbers"
                value={newList.numbers}
                onChange={(e) => setNewList((prev) => ({ ...prev, numbers: e.target.value }))}
                placeholder="Digite os números, um por linha&#10;Ex:&#10;11987654321&#10;11123456789"
                rows={8}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Números devem ter pelo menos 8 dígitos. Caracteres especiais serão removidos automaticamente.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button onClick={createList} disabled={isLoading}>
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Criar Lista
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false)
                  setNewList({ name: "", numbers: "", ddd: "" })
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Listas */}
      <div className="grid gap-4">
        {lists.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma lista criada</p>
                <p className="text-sm text-muted-foreground mt-2">Crie sua primeira lista de chamadas</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          lists.map((list) => (
            <Card key={list.id} className={list.status === "active" ? "border-green-200" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {list.name}
                  {list.ddd && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      DDD {list.ddd}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(list.status)} className="flex items-center">
                    {getStatusIcon(list.status)}
                    <span className="ml-1 capitalize">{list.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{list.totalNumbers}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{list.completedCalls}</p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{list.conferenceGroups.length}</p>
                    <p className="text-sm text-muted-foreground">Grupos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Math.round(list.progress)}%</p>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  {list.status === "paused" && (
                    <Button
                      size="sm"
                      onClick={() => sendListToDevices(list.id)}
                      disabled={isLoading || connectedDevicesCount === 0}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Enviar para Dispositivos
                    </Button>
                  )}

                  {list.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateListStatus(list.id, "paused")}
                      disabled={isLoading}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  )}

                  {(list.status === "active" || list.status === "paused") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateListStatus(list.id, "completed")}
                      disabled={isLoading}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Parar
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" onClick={() => deleteList(list.id)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  Criada: {new Date(list.createdAt).toLocaleString()} | Atualizada:{" "}
                  {new Date(list.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
