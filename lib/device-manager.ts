interface Device {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  lastSeen: number
  currentList?: string
  callsInProgress: number
}

class DeviceManager {
  private devices: Map<string, Device> = new Map()

  registerDevice(id: string, name: string) {
    this.devices.set(id, {
      id,
      name,
      status: "online",
      lastSeen: Date.now(),
      callsInProgress: 0,
    })
  }

  updateDeviceStatus(id: string, status: Device["status"]) {
    const device = this.devices.get(id)
    if (device) {
      device.status = status
      device.lastSeen = Date.now()
    }
  }

  getDevice(id: string): Device | undefined {
    return this.devices.get(id)
  }

  getAllDevices(): Device[] {
    return Array.from(this.devices.values())
  }

  removeDevice(id: string) {
    this.devices.delete(id)
  }

  updateLastSeen(id: string) {
    const device = this.devices.get(id)
    if (device) {
      device.lastSeen = Date.now()
    }
  }
}

export const deviceManager = new DeviceManager()
