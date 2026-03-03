import { zValidator } from "@hono/zod-validator"
import { streamSSE } from "hono/streaming"
import z from "zod"
import { wait } from "../../lib"
import factory from "./factory"

export default factory
  .createApp()
  .get(
    "/time",
    zValidator("query", z.object({ tz: z.enum(["UTC", "Local"]) })),
    (c) => {
      return streamSSE(c, async (stream) => {
        const tz = c.req.valid("query").tz
        while (true) {
          const date = new Date()
          let time = ""

          if (tz === "UTC") {
            time = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
          } else {
            time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          }

          await stream.writeSSE({
            data: time,
            event: "time",
          })

          await wait(500)
        }
      })
    },
  )
