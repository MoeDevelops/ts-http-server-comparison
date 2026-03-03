import cors from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"
import greeting from "./greeting"
import sse from "./sse"
import ws from "./ws"

const app = new Elysia()
  .use(openapi())
  .use(cors())
  .use(greeting)
  .use(sse)
  .use(ws)
  .listen(4002)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type AppType = typeof app
