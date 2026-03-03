import Elysia, { type ElysiaConfig, status } from "elysia"
import z from "zod"
import { authenticate } from "./auth"

export function createController(config?: ElysiaConfig<string>) {
  return new Elysia(config)
    .macro("auth", {
      headers: z.object({
        authorization: z.string().regex(/^Basic .+$/),
      }),
      resolve({ headers }) {
        const credentials = headers.authorization.slice(6)
        const [username, password] = atob(credentials).split(":")

        const user = authenticate(username, password)

        if (!user) {
          return status("Unauthorized")
        }

        return {
          user: user,
        }
      },
    })
    .macro("authQuery", {
      query: z.object({
        authorization: z.string().regex(/^Basic .+$/),
      }),
      resolve({ query }) {
        const credentials = query.authorization.slice(6)
        const [username, password] = atob(credentials).split(":")

        const user = authenticate(username, password)

        if (!user) {
          return status("Unauthorized")
        }

        return {
          user: user,
        }
      },
    })
}
