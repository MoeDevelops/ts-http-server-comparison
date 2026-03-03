import { zValidator } from "@hono/zod-validator"
import { basicAuth } from "hono/basic-auth"
import z from "zod"
import { users } from "../../lib"
import factory from "./factory"

export default factory
  .createApp()
  .use(
    basicAuth({
      verifyUser: (username, password, c) => {
        const user = users.find(
          (user) => user.name === username && user.password === password,
        )

        if (user) {
          c.set("user", user)
          return true
        }

        return false
      },
    }),
  )
  .post("/", zValidator("json", z.object({ name: z.string() })), (c) => {
    const name = c.req.valid("json").name
    const username = c.get("user")?.name

    return c.text(`Hello, ${username} aka ${name}`)
  })
