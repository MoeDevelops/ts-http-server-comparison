import { treaty } from "@elysiajs/eden"
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Suspense,
} from "solid-js"
import type { AppType } from "../servers/elysia"

export default function Elysia() {
  console.log("Running render")

  type Tz = "UTC" | "Local"

  const auth = `Basic ${btoa("Admin:admin123")}`

  const client = treaty<AppType>("localhost:4002")

  const [name, setName] = createSignal("")
  const [tz, setTz] = createSignal<Tz>("UTC")
  const [time, setTime] = createSignal("No time")
  const [chat, setChat] = createSignal<string[]>([])
  const [msg, setMsg] = createSignal("")
  const [socket, setSocket] =
    createSignal<ReturnType<typeof client.api.ws.chat.subscribe>>()

  const [greeting] = createResource(name, async (name) => {
    const { data, error } = await client.api.greeting.post(
      { name },
      { headers: { authorization: auth } },
    )

    if (error) throw error

    return data
  })

  createEffect(async () => {
    const { data, error } = await client.api.sse.time.get({
      headers: { authorization: auth },
      query: { tz: tz() },
    })

    if (error) throw error

    for await (const chunk of data) {
      setTime(chunk.data)
    }

    onCleanup(() => {
      // TODO Cleanup
    })
  })

  onMount(() => {
    setSocket(
      client.api.ws.chat.subscribe({
        query: { authorization: auth },
      }),
    )

    socket()?.addEventListener("message", (event) => {
      const msg = `${event.data.sender}: ${event.data.content}`
      setChat((prev) => [...prev, msg])
    })

    onCleanup(() => {
      socket()?.close()
    })
  })

  const sendMsg = () => {
    socket()?.send({
      content: msg(),
    })
  }

  return (
    <section>
      <h1>Hono!</h1>
      <div>
        <h2>Greeting:</h2>
        <input type="text" onInput={(e) => setName(e.currentTarget.value)} />
        <p>
          The greeting: <Suspense fallback="...">{greeting()}</Suspense>
        </p>
      </div>
      <div>
        <h2>Time:</h2>
        <select onInput={(e) => setTz(e.currentTarget.value as Tz)}>
          <option>UTC</option>
          <option>Local</option>
        </select>
        <p>{time()}</p>
      </div>
      <br />
      <div>
        <h2>Chat:</h2>
        <input
          type="text"
          onInput={(e) => setMsg(e.target.value)}
          value={msg()}
        />
        <button type="submit" onClick={sendMsg}>
          Send
        </button>
        <div>
          <For each={chat()}>{(chatMsg) => <div>{chatMsg}</div>}</For>
        </div>
      </div>
    </section>
  )
}
