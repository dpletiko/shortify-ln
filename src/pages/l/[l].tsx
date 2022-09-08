import { z, ZodError } from "zod";
import { prisma } from "../../server/db/client";
import { NotFoundError } from "@prisma/client/runtime";
import type { GetServerSideProps, NextPage } from "next";

import Error from 'next/error'
import { Link } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { ChangeEvent, useContext } from "react";

import Prompt from "../../components/Prompt";
import type { FormDataEntries } from "../../components/Prompt";

import { ToastrContext } from "../../components/Toastr";
import type { ToastrContextType } from "../../components/Toastr";

interface Props {
  errorCode: number|undefined,
  link?: Link
}

const Ln: NextPage<Props> = ({ link, errorCode = undefined }) => { 
  const router = useRouter()
  const { info } = useContext(ToastrContext) as ToastrContextType;

  if (errorCode) {
    return (
      <Error 
        statusCode={errorCode} 
      />
    );
  }

  if(link !== undefined) {
    const linkAcl = trpc.useMutation(["link.aclCheck"], {
      onSuccess: () => {
        router.push(link.url)
      }
    });

    const handleLinkAcl = ({ passwd }: FormDataEntries) => {
      console.log(passwd)

      if(!passwd) {
        info({
          title: 'Invalid Link ACL!',
          subtitle: 'ACL is required and can not be empty.'
        })
        return;
      }
      
      linkAcl.mutate({
        id: link.id,
        passwd: passwd.toString(),
      })
    }

    const validateAcl = ({target: { value }}: ChangeEvent<HTMLInputElement>) => {
      console.log(value)
      // if(!Boolean(value.length)) 
    }
    
    return (
      <Prompt
        show={true}
        title="This link is protected."
        description="Please enter the ACL password to proceed."
        actions={{ 
          submit: handleLinkAcl,
          cancel: () => router.replace('/')
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="mt-5 mb-3 group flex flex-row transition-all duration-300 rounded-lg shadowed-container w-3/4 md:w-8/12">
            <input 
              type="text" 
              name="passwd" 
              autoComplete="off"
              onChange={validateAcl}
              className="px-4 py-2 rounded-lg w-full font-medium focus:outline-none dark:bg-transparent text-gray-400"
              placeholder="Enter link ACL password" />
          </div>
          <div className="mb-3 text-sm text-red-500">
            Invalid ACL password.
          </div>
        </div>
      </Prompt>
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
        url: true,
        acl: true,
      },
    });

    if(link.acl.length) {
      return {
        props: {
          link,
        }
      }
    }

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
