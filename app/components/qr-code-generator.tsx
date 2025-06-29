"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, Download, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

export default function QRCodeGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [serverUrl, setServerUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Auto-detect server URL
    if (typeof window !== "undefined") {
      const url = window.location.origin
      setServerUrl(url)
      generateQRCode(url)
    }
  }, [])

  const generateQRCode = async (url?: string) => {
    const targetUrl = url || serverUrl
    if (!targetUrl) return

    setIsGenerating(true)
    try {
      const qrData = JSON.stringify({
        serverUrl: targetUrl,
        timestamp: Date.now(),
        version: "2.1.0",
      })

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      setQrCodeUrl(qrCodeDataUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = "autodialer-qrcode.png"
    link.href = qrCodeUrl
    link.click()
  }

  const copyServerUrl = async () => {
    if (!serverUrl) return

    try {
      await navigator.clipboard.writeText(serverUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Conectar Dispositivo Android</h2>
        <p className="text-muted-foreground">Escaneie o QR Code no aplicativo Android para conectar ao servidor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Servidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="serverUrl">URL do Servidor</Label>
            <div className="flex space-x-2">
              <Input
                id="serverUrl"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="https://seu-servidor.com"
              />
              <Button variant="outline" onClick={copyServerUrl} disabled={!serverUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={() => generateQRCode()} disabled={isGenerating || !serverUrl} className="w-full">
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Gerar QR Code
          </Button>
        </CardContent>
      </Card>

      {qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code para Conexão</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code para conexão" className="border rounded-lg" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Escaneie este QR Code no aplicativo Android</p>
              <Button variant="outline" onClick={downloadQRCode} className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Baixar QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Abra o aplicativo AutoDialer no seu dispositivo Android</li>
            <li>Toque no botão "Escanear QR Code"</li>
            <li>Aponte a câmera para o QR Code acima</li>
            <li>Aguarde a confirmação de conexão</li>
            <li>O dispositivo aparecerá na aba "Dispositivos"</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
