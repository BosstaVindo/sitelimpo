"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Activity, Users } from "lucide-react"

interface ConnectionStats {
  totalDevices: number
  connectedDevices: number
  activeLists: number
  serverStatus: "online" | "offline"
}

export default function ConnectionStatus() {
  const [stats, setStats] = useState<ConnectionStats>({
    totalDevices: 0,
    connectedDevices: 0,
    activeLists: 0,
    serverStatus: "online",
  })

  const fetchStats = async () => {
    try {
      // Buscar dispositivos
      const devicesResponse = await fetch("/api/devices")
      const devicesData = devicesResponse.ok ? await devicesResponse.json() : { devices: [] }

      // Buscar listas
      const listsResponse = await fetch("/api/lists")
      const listsData = listsResponse.ok ? await listsResponse.json() : { lists: [] }

      const connectedDevices = devicesData.devices?.filter((d: any) => d.isConnected).length || 0
      const activeLists = listsData.lists?.filter((l: any) => l.status === "active").length || 0

      setStats({
        totalDevices: devicesData.devices?.length || 0,
        connectedDevices,
        activeLists,
        serverStatus: "online",
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats((prev) => ({ ...prev, serverStatus: "offline" }))
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Atualizar a cada 10 segundos
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {stats.serverStatus === "online" ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <Badge variant={stats.serverStatus === "online" ? "default" : "destructive"}>
                {stats.serverStatus === "online" ? "Sistema Online" : "Sistema Offline"}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm">
                <strong>{stats.connectedDevices}</strong>/{stats.totalDevices} dispositivos conectados
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm">
                <strong>{stats.activeLists}</strong> listas ativas
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Atualizado: {new Date().toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
