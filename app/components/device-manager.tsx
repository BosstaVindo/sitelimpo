"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Trash2, RefreshCw, Wifi, WifiOff, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Device {
  sessionId: string
  deviceType: string
  status: string
  lastSeen: number
  lastSeenFormatted: string
  timeSinceLastSeen: number
  isConnected: boolean
  uptime: number
  userAgent: string
}

interface DeviceSummary {
  total: number
  connected: number
  disconnected: number
}

export default function DeviceManager() {
  const [devices, setDevices] = useState<Device[]>([])
  const [summary, setSummary] = useState<DeviceSummary>({ total: 0, connected: 0, disconnected: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices")
      if (response.ok) {
        const data = await response.json()
        setDevices(data.devices || [])
        setSummary(data.summary || { total: 0, connected: 0, disconnected: 0 })
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
          device_id: sessionId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Dispositivo removido",
        })
        fetchDevices()
      } else {
        throw new Error("Failed to remove device")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover dispositivo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeDisconnectedDevices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove_disconnected",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Sucesso",
          description: data.message,
        })
        fetchDevices()
      } else {
        throw new Error("Failed to remove disconnected devices")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover dispositivos desconectados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatTimeSince = (timeSince: number) => {
    const seconds = Math.floor(timeSince / 1000)
    if (seconds < 60) return `${seconds}s atrás`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m atrás`
    const hours = Math.floor(minutes / 60)
    return `${hours}h atrás`
  }

  useEffect(() => {
    fetchDevices()
    const interval = setInterval(fetchDevices, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Dispositivos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDevices} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {summary.disconnected > 0 && (
            <Button variant="outline" onClick={removeDisconnectedDevices} disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Desconectados
            </Button>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold">{summary.total}</p>
              <p className="text-sm text-muted-foreground">Total de Dispositivos</p>
            </div>
            <Smartphone className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.connected}</p>
              <p className="text-sm text-muted-foreground">Conectados</p>
            </div>
            <Wifi className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold text-red-600">{summary.disconnected}</p>
              <p className="text-sm text-muted-foreground">Desconectados</p>
            </div>
            <WifiOff className="h-8 w-8 text-red-600" />
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
            <Card key={device.sessionId} className={device.isConnected ? "border-green-200" : "border-red-200"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  {device.deviceType || "Dispositivo Android"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={device.isConnected ? "default" : "secondary"} className="flex items-center">
                    {device.isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                    {device.isConnected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Session ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{device.sessionId.substring(0, 20)}...</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Último Acesso</p>
                    <p className="text-sm text-muted-foreground">{formatTimeSince(device.timeSinceLastSeen)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tempo Online</p>
                    <p className="text-sm text-muted-foreground">{formatUptime(device.uptime)}</p>
                  </div>
                </div>

                {device.userAgent && (
                  <div className="mb-4">
                    <p className="text-sm font-medium">User Agent</p>
                    <p className="text-xs text-muted-foreground">{device.userAgent}</p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {device.lastSeenFormatted}
                  </div>
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
