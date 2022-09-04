import { z, ZodError } from "zod";
import { prisma } from "../../server/db/client";
import { NotFoundError } from "@prisma/client/runtime";
import type { GetServerSideProps, NextPage } from "next";

import Error from 'next/error'

interface Props {
  errorCode: number
}

const Ln: NextPage<Props> = ({ errorCode = 500 }) => {
  if (errorCode) {
    return (
      <Error 
        statusCode={errorCode} 
      />
    );
  }
  
  return (
    <></>
  );
}

export default Ln;


const lnSchema = z.object({
  l: z.string().min(3)
})


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { l: lnQuery } = lnSchema.parse(ctx.query || ctx.params)

    const link = await prisma.link.findFirstOrThrow({
      where: {
        ln: lnQuery
      }, 
      select: {
        url: true
      }
    });

    return {
      redirect: {
        permanent: false,
        destination: link.url
      }
    }
  } catch(e) {
    let errorCode = 500

    if(e instanceof NotFoundError) {
      errorCode = 404
    } else if(e instanceof ZodError) {
      errorCode = 422
    }

    return {
      props: { 
        errorCode
      }
    }
  }
};
