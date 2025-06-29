"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Server, Users } from "lucide-react"

interface SystemStatus {
  server: "online" | "offline"
  connectedDevices: number
  activeConnections: number
  lastUpdate: number
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    server: "offline",
    connectedDevices: 0,
    activeConnections: 0,
    lastUpdate: Date.now(),
  })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          const data = await response.json()
          setStatus({
            server: "online",
            connectedDevices: data.connectedDevices || 0,
            activeConnections: data.activeConnections || 0,
            lastUpdate: Date.now(),
          })
        } else {
          setStatus((prev) => ({ ...prev, server: "offline", lastUpdate: Date.now() }))
        }
      } catch (error) {
        setStatus((prev) => ({ ...prev, server: "offline", lastUpdate: Date.now() }))
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 10000) // Verifica a cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {status.server === "online" ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-semibold">Status do Sistema</p>
                <p className="text-sm text-gray-500">
                  Última atualização: {new Date(status.lastUpdate).toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-gray-500" />
              <Badge variant={status.server === "online" ? "default" : "destructive"}>
                {status.server === "online" ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{status.connectedDevices} dispositivos</span>
            </div>

            {status.activeConnections > 0 && (
              <Badge className="bg-blue-100 text-blue-800">{status.activeConnections} ativas</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
