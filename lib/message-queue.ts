interface QueueMessage {
  id: string
  sessionId: string
  type: string
  data: any
  timestamp: number
  retries: number
}

class MessageQueue {
  private queues: Map<string, QueueMessage[]> = new Map()
  private maxRetries = 3
  private retryDelay = 5000

  addMessage(sessionId: string, type: string, data: any): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const message: QueueMessage = {
      id: messageId,
      sessionId,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
    }

    if (!this.queues.has(sessionId)) {
      this.queues.set(sessionId, [])
    }

    this.queues.get(sessionId)!.push(message)
    return messageId
  }

  getMessages(sessionId: string): QueueMessage[] {
    return this.queues.get(sessionId) || []
  }

  removeMessage(sessionId: string, messageId: string): boolean {
    const queue = this.queues.get(sessionId)
    if (!queue) return false

    const index = queue.findIndex((msg) => msg.id === messageId)
    if (index === -1) return false

    queue.splice(index, 1)
    return true
  }

  clearQueue(sessionId: string): void {
    this.queues.delete(sessionId)
  }

  getAllQueues(): Map<string, QueueMessage[]> {
    return this.queues
  }

  retryMessage(sessionId: string, messageId: string): boolean {
    const queue = this.queues.get(sessionId)
    if (!queue) return false

    const message = queue.find((msg) => msg.id === messageId)
    if (!message) return false

    if (message.retries >= this.maxRetries) {
      this.removeMessage(sessionId, messageId)
      return false
    }

    message.retries++
    message.timestamp = Date.now() + this.retryDelay
    return true
  }
}

export const messageQueue = new MessageQueue()
