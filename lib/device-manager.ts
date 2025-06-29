interface Device {
  id: string
  name: string
  status: "connected" | "disconnected" | "calling"
  lastSeen: Date
  currentList?: string
  callsActive: number
  callsCompleted: number
  version?: string
}

class DeviceManager {
  private devices: Map<string, Device> = new Map()
  private readonly TIMEOUT_MS = 60000 // 1 minuto

  addDevice(id: string, name: string, version?: string): Device {
    const device: Device = {
      id,
      name,
      status: "connected",
      lastSeen: new Date(),
      callsActive: 0,
      callsCompleted: 0,
      version,
    }

    this.devices.set(id, device)
    return device
  }

  updateDevice(id: string, updates: Partial<Device>): Device | null {
    const device = this.devices.get(id)
    if (!device) return null

    Object.assign(device, updates, { lastSeen: new Date() })
    return device
  }

  getDevice(id: string): Device | null {
    return this.devices.get(id) || null
  }

  getAllDevices(): Device[] {
    this.checkTimeouts()
    return Array.from(this.devices.values())
  }

  removeDevice(id: string): boolean {
    return this.devices.delete(id)
  }

  heartbeat(id: string): boolean {
    const device = this.devices.get(id)
    if (!device) return false

    device.lastSeen = new Date()
    if (device.status === "disconnected") {
      device.status = "connected"
    }
    return true
  }

  private checkTimeouts(): void {
    const now = new Date()

    for (const [id, device] of this.devices.entries()) {
      const timeDiff = now.getTime() - device.lastSeen.getTime()

      if (timeDiff > this.TIMEOUT_MS && device.status !== "disconnected") {
        device.status = "disconnected"
      }
    }
  }

  getConnectedCount(): number {
    return this.getAllDevices().filter((d) => d.status === "connected").length
  }

  getTotalCalls(): number {
    return this.getAllDevices().reduce((sum, d) => sum + d.callsCompleted, 0)
  }

  getActiveCalls(): number {
    return this.getAllDevices().reduce((sum, d) => sum + d.callsActive, 0)
  }
}

export const deviceManager = new DeviceManager()
export type { Device }
