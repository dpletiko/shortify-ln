// src/pages/ln.ts
import { z, ZodError } from 'zod';
import { prisma } from "./server/db/client";
import { NotFoundError } from "@prisma/client/runtime";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const lnSchema = z.object({
  ln: z.string().min(3)
})

export async function middleware(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith('/ln')) {
  //   const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  //   try {
  //     const { ln: lnQuery } = lnSchema.parse(Object.fromEntries(searchParams.entries()))

  //     const link = await prisma.link.findFirstOrThrow({
  //       where: {
  //         ln: lnQuery
  //       }, 
  //       select: {
  //         url: true
  //       }
  //     });

  //     return NextResponse.redirect(new URL(link.url));
  //   } catch(e) {
  //     if(e instanceof NotFoundError) {
  //       return NextResponse.rewrite(new URL('/404', req.url));
  //     } else if(e instanceof ZodError) {
  //       return NextResponse.rewrite(new URL('/422', req.url));
  //     }
  //   }
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: '/ln/:path*',
}