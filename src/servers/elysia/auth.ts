import { users } from "../../lib"

export const authenticate = (username: string, password: string) => {
  return users.find(
    (user) => user.name === username && user.password === password,
  )
}
