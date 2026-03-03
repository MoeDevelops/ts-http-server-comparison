import { websocket } from "hono/bun"
import { cors } from "hono/cors"
import factory from "./factory"
import greeting from "./greeting"
import sse from "./sse"
import ws from "./ws"

const server = factory
  .createApp()
  .use(cors())

  .route("/api/greeting", greeting)
  .route("/api/sse", sse)
  .route("/api/ws", ws)

export type AppType = typeof server

export default {
  port: 4001,
  fetch: server.fetch,
  websocket,
}
