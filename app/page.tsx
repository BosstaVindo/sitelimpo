"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Users, QrCode, Activity } from "lucide-react"
import CallListManager from "./components/call-list-manager"
import DeviceManager from "./components/device-manager"
import QRCodeGenerator from "./components/qr-code-generator"
import ConnectionStatus from "./components/connection-status"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("lists")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema Auto Dialer</h1>
        <p className="text-gray-600">Gerencie listas de chamadas e dispositivos conectados</p>
      </div>

      <ConnectionStatus />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lists" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Listas
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lists">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Listas de Chamadas</CardTitle>
              <CardDescription>Crie e gerencie listas de números para discagem automática</CardDescription>
            </CardHeader>
            <CardContent>
              <CallListManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos Conectados</CardTitle>
              <CardDescription>Monitore e gerencie dispositivos Android conectados</CardDescription>
            </CardHeader>
            <CardContent>
              <DeviceManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcode">
          <Card>
            <CardHeader>
              <CardTitle>Conectar Dispositivo</CardTitle>
              <CardDescription>Gere um QR Code para conectar novos dispositivos Android</CardDescription>
            </CardHeader>
            <CardContent>
              <QRCodeGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>Monitore o status geral do sistema e estatísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Dispositivos Ativos</h3>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Chamadas Hoje</h3>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Listas Ativas</h3>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
