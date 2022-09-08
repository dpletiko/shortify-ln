import { useContext } from "react";
import { trpc } from "../../utils/trpc";
import Form, { LinkData } from "../../components/Form";
import { ToastrContext } from "../../components/Toastr";
import type { GetServerSideProps, NextPage } from "next";
import type { ToastrContextType } from "../../components/Toastr";
// import { linkRepository } from "../../server/db/redis";

interface Props {
  ln: string
}

const Link: NextPage<Props> = ({ ln }) => {
  const { data: link, isSuccess, error, refetch } = trpc.useQuery(["link.getLinkByLn", { ln }]);
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;

  const linkMutation = trpc.useMutation(["link.update"], {
    onSuccess: () => {
      refetch()
      toastrSuccess('Link successfully updated!')
    },
    onError: error => toastError(error.message)
  });

  if (error) {
    return (
      <div>{error.message}</div>
    );
  }

  if(isSuccess) {
    const handleSubmit = (linkData: LinkData) => {
      console.log(linkData)
      linkMutation.mutate({
        ...link,
        ...linkData,
      })
    }

    return (
      <div className="w-full">
        <div className="flex flex-row">
          <div className="flex flex-1 items-center justify-center text-green-700 font-bold text-3xl transition-all duration-150 mb-9">
            {`${window.location.origin}/l/${link.ln}`}
          </div>
        </div>

        <div className="text-white text-3xl">{JSON.stringify(link.acl)}</div>
        
        <div className="flex flex-row">
          <Form 
            linkData={link}
            onError={toastError}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div>Loading...</div>
  );
}

export default Link;


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {  
  // const getLink = await linkRepository.getLink(ctx.params?.ln as string)
  // console.log(getLink)
  
  return {
    props: {
      ln: ctx.params?.ln as string
    }
  }
};
