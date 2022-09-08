import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ToastrContext } from "../components/Toastr";
import type { ToastrContextType } from "../components/Toastr";
import { useContext, useState } from "react";
import Form, { INITIAL_LINK_DATA, LinkData } from "../components/Form";

const Home: NextPage = () => {
  const [link, setLink] = useState<LinkData>({...INITIAL_LINK_DATA})

  const [ln, previewLink] = useState<string>('')
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;

  const linkMutation = trpc.useMutation(["link.create"], {
    onSuccess: (newLink) => {
      console.log(newLink)

      setLink({...INITIAL_LINK_DATA})
      previewLink(`${window.location.origin}/l/${newLink.ln}`)

      toastrSuccess('Link successfully shortened!')
    },
    onError: error => {
      toastError(error.message)
    }
  });

  const handleSubmit = (linkData: LinkData) => {
    console.log(linkData)
    linkMutation.mutate(linkData)
  }

  return (
    <div className="w-full">
      <div className="flex flex-row">
        {ln && (
          <div className="flex flex-1 items-center justify-center text-green-700 font-bold text-3xl transition-all duration-150 mb-9">
            {ln}
          </div>
        )}
      </div>
      
      <div className="flex flex-row">
        <Form 
          linkData={link}
          onError={toastError}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}