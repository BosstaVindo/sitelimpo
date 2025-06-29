"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QrCode, Smartphone, Download, ExternalLink, RefreshCw } from "lucide-react"
import QRCodeGenerator from "@/components/qr-code-generator"

interface ConnectionData {
  type: string
  server_url: string
  session_id: string
  connection_type: string
  endpoints: {
    connect: string
    poll: string
    send: string
    health: string
  }
  polling_interval: number
  server_name: string
  timestamp: number
  version: string
}

export default function ConnectPage() {
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateConnectionData = () => {
    setIsGenerating(true)

    const baseUrl = window.location.origin
    const sessionId = `session_${Date.now()}${Math.random().toString(36).substring(2, 15)}`

    const data: ConnectionData = {
      type: "autodialer_connection_http",
      server_url: baseUrl,
      session_id: sessionId,
      connection_type: "http_polling",
      endpoints: {
        connect: `${baseUrl}/api/connect`,
        poll: `${baseUrl}/api/poll`,
        send: `${baseUrl}/api/send`,
        health: `${baseUrl}/api/health`,
      },
      polling_interval: 5000,
      server_name: "Autodialer Server",
      timestamp: Date.now(),
      version: "2.1.0",
    }

    setConnectionData(data)
    setIsGenerating(false)
  }

  useEffect(() => {
    generateConnectionData()
  }, [])

  const downloadApk = () => {
    // Simular download do APK
    const link = document.createElement("a")
    link.href = "/autodialer-app.apk"
    link.download = "autodialer-app.apk"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Conectar Dispositivo</h1>
        <p className="text-muted-foreground">
          Escaneie o QR Code com o aplicativo Autodialer para conectar seu dispositivo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              QR Code de Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionData ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QRCodeGenerator data={JSON.stringify(connectionData)} size={256} />
                </div>

                <div className="text-center space-y-2">
                  <Badge variant="outline">Session: {connectionData.session_id.substring(0, 16)}...</Badge>
                  <p className="text-sm text-muted-foreground">QR Code válido por esta sessão</p>
                </div>

                <Button
                  variant="outline"
                  onClick={generateConnectionData}
                  disabled={isGenerating}
                  className="w-full bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  Gerar Novo QR Code
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Gerando QR Code...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Como Conectar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Instale o Aplicativo</p>
                  <p className="text-sm text-muted-foreground">
                    Baixe e instale o aplicativo Autodialer no seu dispositivo Android
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Permissões</p>
                  <p className="text-sm text-muted-foreground">
                    Conceda as permissões necessárias: Câmera, Telefone, Internet
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Escaneie o QR Code</p>
                  <p className="text-sm text-muted-foreground">
                    Use o botão "Escanear QR" no aplicativo para ler o código acima
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Conexão Estabelecida</p>
                  <p className="text-sm text-muted-foreground">
                    O dispositivo aparecerá na aba "Dispositivos" quando conectado
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button onClick={downloadApk} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar APK (Android)
              </Button>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="/mobile-simulator" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Simulador Mobile
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Técnicas */}
      {connectionData && (
        <Card>
          <CardHeader>
            <CardTitle>Informações de Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Tipo de Conexão</p>
                <p className="text-muted-foreground">{connectionData.connection_type}</p>
              </div>
              <div>
                <p className="font-medium">Intervalo de Polling</p>
                <p className="text-muted-foreground">{connectionData.polling_interval}ms</p>
              </div>
              <div>
                <p className="font-medium">Servidor</p>
                <p className="text-muted-foreground">{connectionData.server_url}</p>
              </div>
              <div>
                <p className="font-medium">Versão</p>
                <p className="text-muted-foreground">{connectionData.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
