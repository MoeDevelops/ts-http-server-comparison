import z from "zod"
import { createController } from "./factory"

export default createController({ prefix: "/api" }).post(
  "/greeting",
  ({ body, user }) => {
    const name = body.name
    const username = user.name
    return `Hello, ${username} or ${name}`
  },
  {
    body: z.object({ name: z.string() }),
    auth: true,
  },
)
