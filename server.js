const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { WebSocketServer } = require("ws")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })

  // WebSocket Server
  const wss = new WebSocketServer({
    server,
    path: "/api/websocket",
  })

  const connections = new Map()
  const deviceSessions = new Map()

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const sessionId = url.searchParams.get("session")

    if (!sessionId) {
      ws.close(1008, "Session ID required")
      return
    }

    console.log(`Nova conexão WebSocket: ${sessionId}`)

    connections.set(sessionId, ws)
    deviceSessions.set(sessionId, {
      id: sessionId,
      status: "connected",
      lastActivity: Date.now(),
      ws,
    })

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString())
        console.log(`Mensagem de ${sessionId}:`, message)

        // Processar mensagem
        switch (message.type) {
          case "device_connect":
            ws.send(
              JSON.stringify({
                type: "connection_confirmed",
                session_id: sessionId,
                timestamp: Date.now(),
              }),
            )
            break

          case "ping":
            ws.send(
              JSON.stringify({
                type: "pong",
                timestamp: Date.now(),
              }),
            )
            break
        }
      } catch (error) {
        console.error("Erro ao processar mensagem:", error)
      }
    })

    ws.on("close", () => {
      console.log(`Conexão fechada: ${sessionId}`)
      connections.delete(sessionId)
      deviceSessions.delete(sessionId)
    })

    ws.on("error", (error) => {
      console.error("Erro WebSocket:", error)
    })
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket Server ready`)
  })
})
