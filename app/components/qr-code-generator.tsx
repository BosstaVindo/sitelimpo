"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, RefreshCw, Copy, Check } from "lucide-react"
import QRCodeLib from "qrcode"

export function QRCodeGenerator() {
  const [serverUrl, setServerUrl] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Detecta automaticamente a URL do servidor
    if (typeof window !== "undefined") {
      const url = `${window.location.protocol}//${window.location.host}`
      setServerUrl(url)
    }
  }, [])

  const generateQRCode = async () => {
    if (!serverUrl) return

    try {
      const connectionData = {
        serverUrl,
        timestamp: Date.now(),
        type: "autodialer_connection",
      }

      const qrData = JSON.stringify(connectionData)
      const qrCodeDataUrl = await QRCodeLib.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      setQrCodeUrl(qrCodeDataUrl)
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(serverUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
    }
  }

  useEffect(() => {
    if (serverUrl) {
      generateQRCode()
    }
  }, [serverUrl])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Gerador de QR Code
          </CardTitle>
          <CardDescription>Gere um QR Code para conectar dispositivos Android ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server-url">URL do Servidor</Label>
            <div className="flex gap-2">
              <Input
                id="server-url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://seu-servidor.com"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={generateQRCode} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Gerar QR Code
          </Button>
        </CardContent>
      </Card>

      {qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code de Conexão</CardTitle>
            <CardDescription>Escaneie este código no aplicativo Android para conectar o dispositivo</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code de Conexão" className="mx-auto" />
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Como usar:</h4>
              <ol className="text-sm text-blue-800 text-left space-y-1">
                <li>1. Instale o app AutoDialer no dispositivo Android</li>
                <li>2. Abra o app e toque em "Conectar via QR Code"</li>
                <li>3. Escaneie este QR Code com a câmera</li>
                <li>4. O dispositivo será conectado automaticamente</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
