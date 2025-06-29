"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, Wifi, WifiOff, Phone, Pause } from "lucide-react"

interface Device {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  lastSeen: number
  currentList?: string
  callsInProgress: number
}

export function DeviceManager() {
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/api/devices")
        if (response.ok) {
          const data = await response.json()
          setDevices(data.devices || [])
        }
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error)
      }
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 5000) // Atualiza a cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "busy":
        return <Phone className="h-4 w-4 text-yellow-500" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "offline":
        return <Badge variant="secondary">Offline</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">Ocupado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Agora mesmo"
    if (minutes < 60) return `${minutes}m atrás`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`

    const days = Math.floor(hours / 24)
    return `${days}d atrás`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Dispositivos Conectados
          </CardTitle>
          <CardDescription>Monitore o status dos dispositivos Android conectados</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {devices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Nenhum dispositivo conectado</p>
              <p className="text-sm text-gray-400">Use o QR Code para conectar dispositivos Android</p>
            </CardContent>
          </Card>
        ) : (
          devices.map((device) => (
            <Card key={device.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(device.status)}
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-gray-500">ID: {device.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">{getStatusBadge(device.status)}</div>
                      <p className="text-xs text-gray-500">Visto: {formatLastSeen(device.lastSeen)}</p>
                    </div>
                  </div>
                </div>

                {device.status === "busy" && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Chamadas em andamento: {device.callsInProgress}
                        </p>
                        {device.currentList && (
                          <p className="text-xs text-yellow-600">Lista atual: {device.currentList}</p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-1" />
                        Pausar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {devices.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {devices.filter((d) => d.status === "online").length}
                </p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {devices.filter((d) => d.status === "busy").length}
                </p>
                <p className="text-sm text-gray-500">Ocupados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {devices.filter((d) => d.status === "offline").length}
                </p>
                <p className="text-sm text-gray-500">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
