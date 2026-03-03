import { createFactory } from "hono/factory"
import type { User } from "../../lib"

export type Env = {
  Variables: {
    user?: User
  }
}

const factory = createFactory<Env>()

export default factory
