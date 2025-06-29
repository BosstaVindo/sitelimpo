import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CallListManager } from "./components/call-list-manager"
import { DeviceManager } from "./components/device-manager"
import { QRCodeGenerator } from "./components/qr-code-generator"
import { ConnectionStatus } from "./components/connection-status"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema AutoDialer</h1>
          <p className="text-gray-600">Gerencie listas de chamadas e dispositivos conectados</p>
        </div>

        <ConnectionStatus />

        <Tabs defaultValue="lists" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lists">Listas de Chamadas</TabsTrigger>
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="lists" className="mt-6">
            <CallListManager />
          </TabsContent>

          <TabsContent value="devices" className="mt-6">
            <DeviceManager />
          </TabsContent>

          <TabsContent value="qr" className="mt-6">
            <QRCodeGenerator />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <div className="grid gap-4">
              <ConnectionStatus />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
