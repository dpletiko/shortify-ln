import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedLinkRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })

  .query("getLinks", {
    async resolve({ ctx }) {
      return await ctx.prisma.link.findMany({
        where: {
          user: ctx.session.user
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    },
  })
  .query("getLinkById", {
    input: z
      .object({
        id: z.string(),
      }),
    async resolve({ ctx, input: { id } }) {
      return await ctx.prisma.link.findFirstOrThrow({
        where: {
          user: ctx.session.user,
          id
        },
        include: {
          acl: true
        }
      });
    },
  })
  .query("getLinkByLn", {
    input: z
      .object({
        ln: z.string(),
      }),
    async resolve({ ctx, input: { ln } }) {
      return await ctx.prisma.link.findFirstOrThrow({
        where: {
          user: ctx.session.user,
          ln
        },
        include: {
          acl: true
        }
      });
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
        },
        include: {
          acl: true
        }
      })
    },
  })
  .mutation("update", {
    input: z
      .object({
        // ln: z.string().nullable(),
        id: z.string(),
        url: z.string(),
        protected: z.boolean(),
        acl: z.array(z.object({
          id: z.string().nullish(),
          passwd: z.string(),
          multi: z.boolean(),
          // enabled: z.boolean(),
        }))
      }),
    async resolve({ ctx, input }) {
      const aclIdsToDelete = await ctx.prisma.linkControl.findMany({
        where: {
          linkId: input.id,
          id: {
            notIn: input.acl.filter(({id}) => typeof id === 'string').map(({id}) => id as string)
          },
        },
        select: {
          id: true
        }
      });
      
      return await ctx.prisma.link.update({
        where: {
          id: input.id,
        },
        data: {
          url: input.url,
          protected: input.protected,
          acl: {
            deleteMany: aclIdsToDelete.map(({id}) => ({
              id
            })),
            updateMany: input.acl.filter(({id}) => typeof id === 'string').map(({id, passwd, multi}) => ({
              where: { id: id as string },
              data: { passwd, multi }
            })),
            create: input.acl.filter(({id}) => typeof id !== 'string').map(({passwd, multi}) => ({
              passwd, multi
            })),
          }
        },
        include: {
          acl: true
        }
      })
    },
  })
  .mutation("aclCheck", {
    input: z
      .object({
        id: z.string(),
        passwd: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.linkControl.findFirstOrThrow({
        where: {
          linkId: input.id,
          passwd: input.passwd
        },
        select: {
          id: true
        }
      })
      .then(l => Boolean(l));
    },
  })
  .mutation("destroy", {
    input: z
      .object({
        id: z.string(),
      }),
    async resolve({ ctx, input: { id } }) {
      return await ctx.prisma.link.delete({
        where: { id }
      });
    },
  });
