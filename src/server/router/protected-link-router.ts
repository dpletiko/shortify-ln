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
        // ln: z.string().nullable(),
        url: z.string(),
        protected: z.boolean(),
        acl: z.array(z.object({
          passwd: z.string(),
          multi: z.boolean(),
          // enabled: z.boolean(),
        }))
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.link.create({
        data: {
          ln: undefined,
          url: input.url,
          protected: input.protected,
          userId: ctx.session.user.id,
          acl: {
            create: input.acl
          }
        }
      })
    },
  })
  .query("getLinks", {
    async resolve({ ctx }) {
      return await ctx.prisma.link.findMany();
    },
  });
