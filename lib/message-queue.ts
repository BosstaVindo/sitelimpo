interface QueueMessage {
  id: string
  deviceId: string
  type: "CALL_LIST" | "CONTROL" | "STATUS"
  data: any
  timestamp: Date
  retries: number
}

class MessageQueue {
  private queue: Map<string, QueueMessage[]> = new Map()
  private maxRetries = 3

  addMessage(deviceId: string, type: QueueMessage["type"], data: any): string {
    const message: QueueMessage = {
      id: Math.random().toString(36).substr(2, 9),
      deviceId,
      type,
      data,
      timestamp: new Date(),
      retries: 0,
    }

    if (!this.queue.has(deviceId)) {
      this.queue.set(deviceId, [])
    }

    this.queue.get(deviceId)!.push(message)
    return message.id
  }

  getMessages(deviceId: string): QueueMessage[] {
    return this.queue.get(deviceId) || []
  }

  removeMessage(deviceId: string, messageId: string): boolean {
    const messages = this.queue.get(deviceId)
    if (!messages) return false

    const index = messages.findIndex((m) => m.id === messageId)
    if (index === -1) return false

    messages.splice(index, 1)
    return true
  }

  retryMessage(deviceId: string, messageId: string): boolean {
    const messages = this.queue.get(deviceId)
    if (!messages) return false

    const message = messages.find((m) => m.id === messageId)
    if (!message) return false

    if (message.retries >= this.maxRetries) {
      this.removeMessage(deviceId, messageId)
      return false
    }

    message.retries++
    message.timestamp = new Date()
    return true
  }

  clearDevice(deviceId: string): void {
    this.queue.delete(deviceId)
  }

  getQueueSize(deviceId: string): number {
    return this.queue.get(deviceId)?.length || 0
  }
}

export const messageQueue = new MessageQueue()
export type { QueueMessage }
