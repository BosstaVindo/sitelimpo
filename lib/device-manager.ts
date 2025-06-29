interface Device {
  sessionId: string
  deviceType: string
  status: string
  lastSeen: number
  isConnected: boolean
  callsToday?: number
  currentList?: string
}

class DeviceManager {
  private devices: Map<string, Device> = new Map()
  private connectionTimeout = 30000 // 30 seconds

  addDevice(sessionId: string, deviceType = "android"): Device {
    const device: Device = {
      sessionId,
      deviceType,
      status: "connected",
      lastSeen: Date.now(),
      isConnected: true,
      callsToday: 0,
    }

    this.devices.set(sessionId, device)
    return device
  }

  updateDevice(sessionId: string, updates: Partial<Device>): boolean {
    const device = this.devices.get(sessionId)
    if (!device) return false

    Object.assign(device, updates, { lastSeen: Date.now() })
    return true
  }

  getDevice(sessionId: string): Device | undefined {
    return this.devices.get(sessionId)
  }

  getAllDevices(): Device[] {
    return Array.from(this.devices.values())
  }

  removeDevice(sessionId: string): boolean {
    return this.devices.delete(sessionId)
  }

  updateLastSeen(sessionId: string): boolean {
    const device = this.devices.get(sessionId)
    if (!device) return false

    device.lastSeen = Date.now()
    device.isConnected = true
    return true
  }

  checkConnections(): void {
    const now = Date.now()

    for (const [sessionId, device] of this.devices.entries()) {
      if (now - device.lastSeen > this.connectionTimeout) {
        device.isConnected = false
        device.status = "disconnected"
      }
    }
  }

  getConnectedDevices(): Device[] {
    return this.getAllDevices().filter((device) => device.isConnected)
  }

  getDeviceStats(): { total: number; connected: number; disconnected: number } {
    const devices = this.getAllDevices()
    const connected = devices.filter((d) => d.isConnected).length

    return {
      total: devices.length,
      connected,
      disconnected: devices.length - connected,
    }
  }
}

export const deviceManager = new DeviceManager()

// Check connections every 10 seconds
setInterval(() => {
  deviceManager.checkConnections()
}, 10000)
