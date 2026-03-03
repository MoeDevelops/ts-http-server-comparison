import { upgradeWebSocket } from "hono/bun"
import { wait } from "../../lib"
import factory from "./factory"

export default factory.createApp().get(
  "/chat",
  upgradeWebSocket(() => {
    return {
      onOpen(_event, ws) {
        ws.send("Hello!")
      },
      async onMessage(event, ws) {
        const msg = event.data.toString()
        await wait(300)
        ws.send(msg)
      },
    }
  }),
)
