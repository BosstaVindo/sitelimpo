"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface QRCodeGeneratorProps {
  serverUrl?: string
  sessionId?: string
}

export default function QRCodeGenerator({ serverUrl, sessionId }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [qrData, setQrData] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [customServerUrl, setCustomServerUrl] = useState(serverUrl || "https://autodialer-system.onrender.com")
  const [customSessionId, setCustomSessionId] = useState(sessionId || "")

  const generateSessionId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 10)
    return `session_${timestamp}_${random}`
  }

  const generateQRCode = async () => {
    setIsGenerating(true)

    try {
      const finalSessionId = customSessionId || generateSessionId()
      const baseUrl = customServerUrl.replace(/\/$/, "") // Remove trailing slash

      const connectionData = {
        type: "autodialer_connection_http",
        server_url: baseUrl,
        session_id: finalSessionId,
        connection_type: "http_polling",
        polling_interval: 3000,
        server_name: "AutoDialer Server",
        timestamp: Date.now(),
        version: "2.1",
        endpoints: {
          connect: `${baseUrl}/api/connect?session=${finalSessionId}`,
          poll: `${baseUrl}/api/poll?session=${finalSessionId}`,
          send: `${baseUrl}/api/send?session=${finalSessionId}`,
          health: `${baseUrl}/health?session=${finalSessionId}`,
        },
      }

      const jsonData = JSON.stringify(connectionData, null, 2)
      setQrData(jsonData)

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      setQrCodeUrl(qrCodeDataUrl)
      setCustomSessionId(finalSessionId)

      toast({
        title: "✅ QR Code gerado",
        description: `Sessão: ${finalSessionId.substring(0, 20)}...`,
      })
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error)
      toast({
        title: "❌ Erro",
        description: "Falha ao gerar QR Code",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      toast({
        title: "📋 Copiado",
        description: "Dados do QR Code copiados para a área de transferência",
      })
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Falha ao copiar dados",
        variant: "destructive",
      })
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `autodialer-qr-${customSessionId}.png`
    link.href = qrCodeUrl
    link.click()

    toast({
      title: "💾 Download iniciado",
      description: "QR Code salvo como imagem",
    })
  }

  useEffect(() => {
    if (serverUrl && sessionId) {
      generateQRCode()
    }
  }, [serverUrl, sessionId])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📱 Gerador de QR Code</CardTitle>
        <CardDescription>Gere um QR Code para conectar dispositivos Android ao sistema AutoDialer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="serverUrl">URL do Servidor</Label>
            <Input
              id="serverUrl"
              value={customServerUrl}
              onChange={(e) => setCustomServerUrl(e.target.value)}
              placeholder="https://autodialer-system.onrender.com"
            />
          </div>

          <div>
            <Label htmlFor="sessionId">Session ID (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="sessionId"
                value={customSessionId}
                onChange={(e) => setCustomSessionId(e.target.value)}
                placeholder="Deixe vazio para gerar automaticamente"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCustomSessionId(generateSessionId())}
                title="Gerar novo Session ID"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Botão para gerar */}
        <Button onClick={generateQRCode} disabled={isGenerating || !customServerUrl} className="w-full">
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Gerando QR Code...
            </>
          ) : (
            "🔄 Gerar QR Code"
          )}
        </Button>

        {/* QR Code gerado */}
        {qrCodeUrl && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code para conexão AutoDialer"
                  className="w-64 h-64"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={copyQRData}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar Dados
              </Button>
              <Button variant="outline" onClick={downloadQRCode}>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            </div>

            {/* Informações da sessão */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">📋 Informações da Conexão:</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Servidor:</strong> {customServerUrl}
                </p>
                <p>
                  <strong>Sessão:</strong> {customSessionId}
                </p>
                <p>
                  <strong>Tipo:</strong> HTTP Polling
                </p>
                <p>
                  <strong>Intervalo:</strong> 3 segundos
                </p>
              </div>
            </div>

            {/* Dados JSON (colapsível) */}
            <details className="space-y-2">
              <summary className="cursor-pointer font-semibold">🔍 Ver dados JSON completos</summary>
              <Textarea value={qrData} readOnly rows={10} className="font-mono text-xs" />
            </details>
          </div>
        )}

        {/* Instruções */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📱 Como usar:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Abra o app AutoDialer no Android</li>
            <li>Toque em "📷 QR Scanner"</li>
            <li>Escaneie o QR Code gerado acima</li>
            <li>Aguarde a confirmação de conexão</li>
            <li>O dispositivo estará pronto para receber conferências</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
