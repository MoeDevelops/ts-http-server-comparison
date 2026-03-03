import { hc } from "hono/client"
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  Suspense,
} from "solid-js"
import type { AppType } from "../servers/hono"

export default function Hono() {
  console.log("Running render")

  type Tz = "UTC" | "Local"

  const auth = `Basic ${btoa("Admin:admin123")}`

  const client = hc<AppType>("http://localhost:4001", {
    headers: {
      Authorization: auth,
    },
  })

  const [name, setName] = createSignal("")
  const [tz, setTz] = createSignal<Tz>("UTC")
  const [time, setTime] = createSignal("No time")
  const [chat, setChat] = createSignal<string[]>([])
  const [msg, setMsg] = createSignal("")

  const [greeting] = createResource(name, async (name) => {
    return await client.api.greeting
      .$post({ json: { name } })
      .then((r) => r.text())
  })

  createEffect(() => {
    const eventSource = new EventSource(
      `${client.api.sse.time.$url({ query: { tz: tz() } })}`,
    )
    eventSource.addEventListener("time", (e) => {
      setTime(String(e.data))
    })

    onCleanup(() => eventSource.close())
  })

  const chatSocket = client.api.ws.chat.$ws(0)

  chatSocket.addEventListener("message", (event) => {
    setChat((prev) => [...prev, event.data])
  })

  const sendMsg = () => {
    const message = msg()
    if (chatSocket.readyState === chatSocket.OPEN) {
      console.log("WS is Open")
      chatSocket.send(message)
    }
    setMsg("")
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
