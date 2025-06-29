"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Server, AlertCircle } from "lucide-react"

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "checking">("checking")

  const checkServerStatus = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-cache",
      })

      if (response.ok) {
        setServerStatus("online")
      } else {
        setServerStatus("offline")
      }
    } catch (error) {
      setServerStatus("offline")
    }
  }

  useEffect(() => {
    // Check initial server status
    checkServerStatus()

    // Check server status every 30 seconds
    const serverInterval = setInterval(checkServerStatus, 30000)

    // Monitor browser online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(serverInterval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getStatusColor = () => {
    if (!isOnline || serverStatus === "offline") return "destructive"
    if (serverStatus === "checking") return "secondary"
    return "default"
  }

  const getStatusText = () => {
    if (!isOnline) return "Sem conexão com a internet"
    if (serverStatus === "offline") return "Servidor offline"
    if (serverStatus === "checking") return "Verificando conexão..."
    return "Sistema online"
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />
    if (serverStatus === "offline") return <AlertCircle className="h-4 w-4" />
    if (serverStatus === "checking") return <Server className="h-4 w-4" />
    return <Wifi className="h-4 w-4" />
  }

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor()} className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2">{getStatusText()}</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</div>
      </CardContent>
    </Card>
  )
}
