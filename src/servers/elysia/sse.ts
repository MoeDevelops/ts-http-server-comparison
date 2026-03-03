import { sse } from "elysia"
import z from "zod"
import { wait } from "../../lib"
import { createController } from "./factory"

export default createController({ prefix: "/api" }).get(
  "/sse/time",
  async function* ({ query }) {
    const tz = query.tz

    while (true) {
      const date = new Date()
      let time = ""

      if (tz === "UTC") {
        time = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
      } else {
        time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }

      yield sse({
        data: time,
        event: "time",
      })

      await wait(500)
    }
  },
  {
    query: z.object({
      tz: z.enum(["UTC", "Local"]),
    }),
    auth: true,
  },
)
