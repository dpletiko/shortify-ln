// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedLinkRouter } from "./protected-link-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("link.", protectedLinkRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
