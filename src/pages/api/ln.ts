// src/pages/api/ln.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { z, ZodError } from 'zod';
import { NotFoundError } from "@prisma/client/runtime";

const lnSchema = z.object({
  ln: z.string().min(3)
})

const redirectLn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { ln: lnQuery } = lnSchema.parse(req.query)

    const link = await prisma.link.findFirstOrThrow({
      where: {
        ln: lnQuery
      }, 
      select: {
        url: true
      }
    });

    res.redirect(link.url)
  } catch(e) {
    if(e instanceof NotFoundError) {
      return res.status(404).json({
        message: 'Link not found!'
      }) 
    } else if(e instanceof ZodError) {
      return res.status(422).json({
        errors: e.errors
      }) 
    }

    return res.status(500).json({
      message: 'Something went wrong!'
    }) 
  }
};

export default redirectLn;
