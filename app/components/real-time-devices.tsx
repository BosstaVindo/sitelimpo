"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Battery, Signal, Phone, Trash2, RefreshCw, Wifi } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Device {
  id: string
  sessionId: string
  deviceInfo: {
    model: string
    manufacturer: string
    androidVersion: string
    appVersion: string
  }
  connectionInfo: {
    ip: string
    userAgent: string
    connectedAt: string
    lastSeen: string
  }
  status: {
    isConnected: boolean
    battery: number
    signal: number
    callsToday: number
  }
}

export default function RealTimeDevices() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices")
      const data = await response.json()

      if (data.success) {
        setDevices(data.devices || [])
        setLastUpdate(new Date())
      } else {
        console.error("Erro ao buscar dispositivos:", data.error)
      }
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dispositivos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchDevices, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm("Tem certeza que deseja remover este dispositivo?")) return

    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
          device_id: deviceId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Dispositivo removido com sucesso",
        })
        fetchDevices()
      } else {
        throw new Error(data.error || "Erro ao remover dispositivo")
      }
    } catch (error) {
      console.error("Erro ao remover dispositivo:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover dispositivo",
        variant: "destructive",
      })
    }
  }

  const handleRemoveDisconnectedDevices = async () => {
    const disconnectedDevices = devices.filter((device) => !device.status.isConnected)

    if (disconnectedDevices.length === 0) {
      toast({
        title: "Info",
        description: "Não há dispositivos desconectados para remover",
      })
      return
    }

    if (!confirm(`Tem certeza que deseja remover ${disconnectedDevices.length} dispositivos desconectados?`)) return

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

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `${data.removed_count} dispositivos removidos`,
        })
        fetchDevices()
      } else {
        throw new Error(data.error || "Erro ao remover dispositivos")
      }
    } catch (error) {
      console.error("Erro ao remover dispositivos:", error)
      toast({
        title: "Erro",
        description: "Erro ao remover dispositivos desconectados",
        variant: "destructive",
      })
    }
  }

  const connectedDevices = devices.filter((device) => device.status.isConnected)
  const disconnectedDevices = devices.filter((device) => !device.status.isConnected)

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)

    if (diffSeconds < 60) {
      return `${diffSeconds}s atrás`
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m atrás`
    } else {
      return date.toLocaleString()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando dispositivos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dispositivos Conectados ({devices.length})</CardTitle>
              <CardDescription>
                {connectedDevices.length} conectados • {disconnectedDevices.length} desconectados • Última atualização:{" "}
                {lastUpdate.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {disconnectedDevices.length > 0 && (
                <Button onClick={handleRemoveDisconnectedDevices} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover Desconectados ({disconnectedDevices.length})
                </Button>
              )}
              <Button onClick={fetchDevices} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dispositivo conectado</h3>
              <p className="text-gray-600">Escaneie o QR Code com o app Android para conectar</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Dispositivos Conectados */}
              {connectedDevices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    Conectados ({connectedDevices.length})
                  </h3>
                  <div className="grid gap-3">
                    {connectedDevices.map((device) => (
                      <div key={device.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Smartphone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {device.deviceInfo.manufacturer} {device.deviceInfo.model}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Android {device.deviceInfo.androidVersion} • App {device.deviceInfo.appVersion}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                            <Button
                              onClick={() => handleRemoveDevice(device.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{device.status.battery}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Signal className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{device.status.signal}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{device.status.callsToday} chamadas</span>
                          </div>
                          <div className="text-gray-600">IP: {device.connectionInfo.ip}</div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          Conectado em: {new Date(device.connectionInfo.connectedAt).toLocaleString()} • Última
                          atividade: {formatLastSeen(device.connectionInfo.lastSeen)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dispositivos Desconectados */}
              {disconnectedDevices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                    <Smartphone className="h-4 w-4 mr-1" />
                    Desconectados ({disconnectedDevices.length})
                  </h3>
                  <div className="grid gap-3">
                    {disconnectedDevices.map((device) => (
                      <div key={device.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Smartphone className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {device.deviceInfo.manufacturer} {device.deviceInfo.model}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Android {device.deviceInfo.androidVersion} • App {device.deviceInfo.appVersion}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Desconectado</Badge>
                            <Button
                              onClick={() => handleRemoveDevice(device.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{device.status.battery}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Signal className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{device.status.signal}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{device.status.callsToday} chamadas</span>
                          </div>
                          <div className="text-gray-500">IP: {device.connectionInfo.ip}</div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          Última conexão: {formatLastSeen(device.connectionInfo.lastSeen)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
