import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedLinkRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .mutation("create", {
    input: z
      .object({
        url: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.create({
        data: {
          url: input.url,
          ln: undefined,
          userId: ctx.session.user.id,
        }
      })
    },
  })
  .query("getLinks", {
    async resolve({ ctx }) {
      return await ctx.prisma.link.findMany();
    },
  });
