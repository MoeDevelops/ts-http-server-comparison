import z from "zod"
import { wait } from "../../lib"
import { createController } from "./factory"

export default createController({ prefix: "/api" }).ws("/ws/chat", {
  body: z.object({
    content: z.string(),
  }),
  response: z.object({
    sender: z.string(),
    content: z.string(),
  }),
  authQuery: true,
  async message({ send, data: { user } }, message) {
    await wait(300)
    send({
      sender: user.name,
      content: message.content,
    })
  },
  open({ send }) {
    send({
      sender: "Server",
      content: "Hello!",
    })
  },
})
