import { A, useLocation } from "@solidjs/router"
import { type Component, Suspense } from "solid-js"

const App: Component<{ children: Element }> = (props) => {
  const location = useLocation()

  return (
    <>
      <nav class="flex items-center">
        <A href="/" class="mx-2 no-underline hover:underline">
          Home
        </A>
        <A href="/error" class="mx-2 no-underline hover:underline">
          Error
        </A>
        <A href="/hono" class="mx-2 no-underline hover:underline">
          Hono
        </A>
        <A href="/elysia" class="mx-2 no-underline hover:underline">
          Elysia
        </A>

        <div class="ml-auto">
          <span>URL: </span>
          <input type="text" readOnly value={location.pathname} />
        </div>
      </nav>

      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  )
}

export default App
