import { basicAuth } from "hono/basic-auth"
import { users } from "../../lib"
import factory from "./factory"

export const auth = factory.createMiddleware(
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
