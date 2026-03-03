import type { RouteDefinition } from "@solidjs/router"
import { lazy } from "solid-js"
import Elysia from "./pages/elysia"
import Home from "./pages/home"
import Hono from "./pages/hono"

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/hono",
    component: Hono,
  },
  {
    path: "/elysia",
    component: Elysia,
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
]
