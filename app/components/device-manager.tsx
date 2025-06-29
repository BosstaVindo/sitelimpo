"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Wifi, WifiOff, RefreshCw, Trash2, Phone } from "lucide-react"

interface Device {
  sessionId: string
  deviceType: string
  status: string
  lastSeen: number
  isConnected: boolean
  callsToday?: number
  currentList?: string
}

export default function DeviceManager() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const removeDevice = async (sessionId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
          sessionId: sessionId,
        }),
      })

      if (response.ok) {
        fetchDevices()
      }
    } catch (error) {
      console.error("Error removing device:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
    const interval = setInterval(fetchDevices, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? "default" : "secondary"
  }

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
  }

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}m atrás`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`

    const days = Math.floor(hours / 24)
    return `${days}d atrás`
  }

  const connectedDevices = devices.filter((d) => d.isConnected)
  const totalCalls = devices.reduce((sum, device) => sum + (device.callsToday || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Dispositivos Conectados</h2>
          <p className="text-sm text-muted-foreground">
            {connectedDevices.length} de {devices.length} dispositivos online
          </p>
        </div>
        <Button onClick={fetchDevices} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Smartphone className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{devices.length}</p>
              <p className="text-sm text-muted-foreground">Total de Dispositivos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Wifi className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{connectedDevices.length}</p>
              <p className="text-sm text-muted-foreground">Dispositivos Online</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Phone className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{totalCalls}</p>
              <p className="text-sm text-muted-foreground">Chamadas Hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Dispositivos */}
      <div className="grid gap-4">
        {devices.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum dispositivo conectado</p>
                <p className="text-sm text-muted-foreground mt-2">Use o QR Code para conectar dispositivos Android</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Card key={device.sessionId} className={device.isConnected ? "border-green-200" : "border-gray-200"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Dispositivo Android
                  <Badge variant="outline" className="ml-2 text-xs">
                    {device.sessionId.substring(0, 8)}...
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(device.isConnected)} className="flex items-center">
                    {getStatusIcon(device.isConnected)}
                    <span className="ml-1">{device.isConnected ? "Online" : "Offline"}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{device.callsToday || 0}</p>
                    <p className="text-sm text-muted-foreground">Chamadas Hoje</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{formatLastSeen(device.lastSeen)}</p>
                    <p className="text-sm text-muted-foreground">Última Atividade</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{device.status}</p>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{device.currentList || "Nenhuma"}</p>
                    <p className="text-sm text-muted-foreground">Lista Atual</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Session ID: {device.sessionId}</div>
                  <Button size="sm" variant="ghost" onClick={() => removeDevice(device.sessionId)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
