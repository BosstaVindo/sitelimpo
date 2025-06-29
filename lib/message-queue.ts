interface QueueMessage {
  id: string
  deviceId: string
  type: "call_list" | "command" | "status"
  data: any
  timestamp: number
}

class MessageQueue {
  private queues: Map<string, QueueMessage[]> = new Map()

  addMessage(deviceId: string, message: Omit<QueueMessage, "id" | "timestamp">) {
    if (!this.queues.has(deviceId)) {
      this.queues.set(deviceId, [])
    }

    const fullMessage: QueueMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    this.queues.get(deviceId)!.push(fullMessage)
  }

  getMessages(deviceId: string): QueueMessage[] {
    const messages = this.queues.get(deviceId) || []
    this.queues.set(deviceId, []) // Clear after reading
    return messages
  }

  hasMessages(deviceId: string): boolean {
    return (this.queues.get(deviceId) || []).length > 0
  }
}

export const messageQueue = new MessageQueue()
