export const wait = async (n: number) =>
  await new Promise((r) => setTimeout(r, n))

export type User = {
  name: string
  password: string
}

export const users: User[] = [
  {
    name: "Admin",
    password: "admin123",
  },
  {
    name: "Mario",
    password: "Wario",
  },
]
