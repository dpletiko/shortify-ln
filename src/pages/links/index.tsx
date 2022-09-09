import { trpc } from "../../utils/trpc";
import { Link as dbLink } from "@prisma/client";
import { getSession } from "next-auth/react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useContext, useState } from "react";
import { ToastrContext } from "../../components/Toastr";
import type { ToastrContextType } from "../../components/Toastr";
import Modal from "../../components/Modal";

type LinkRowProps = {
  link: dbLink;
  handleDelete(): void;
};

const Links: NextPage = () => {
  const [selectedLinkId, toggleDestroyPrompt] = useState<string|null>(null)
  
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;
  
  const links = trpc.useQuery(["link.getLinks"]);
  const destroyLink = trpc.useMutation([
    "link.destroy", 
  ], {
    onSuccess: () => {
      links.refetch()
      toggleDestroyPrompt('')
      toastrSuccess('Link successfully removed!')
    },
    onError: error => toastError(error.message)
  });

  const promptDestroyLink = (id: string) => {
    toggleDestroyPrompt(id)
  }
  const handleDestroyLinkSubmit = () => {
    selectedLinkId && destroyLink.mutate({ id: selectedLinkId })
  }
  const handleDestroyLinkCancel = () => {
    toggleDestroyPrompt(null)
  }

  return (
    <div className="w-full glossy">
      <div className="flex items-end justify-end mb-3">
        <Link 
          passHref
          href="/"
        >
          <a title="Create new link" className="flex items-center justify-center rounded-full btn-outline px-4 py-2 outline-none text-sm text-gray-900 hover:text-slate-600 focus:text-slate-600 dark:text-white dark:hover:text-slate-300 dark:focus:text-slate-300 transition-colors duration-250 stroke-gray-900 hover:stroke-slate-600 focus:stroke-slate-600 dark:stroke-white dark:hover:stroke-slate-300 dark:focus:stroke-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="inherit" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Link</span>
          </a>
        </Link>
      </div>


      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2 text-left">
                    URL
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2 text-left">
                    Short
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2 text-left">
                    Protected
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2 text-left">
                    Created At
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.isError && (
                  <tr>
                    <td colSpan={4}>Unable to get data.</td>
                  </tr>
                )}

                {links.isSuccess && links.data.map((link) => (
                  <LinkRow 
                    key={link.id} 
                    link={link} 
                    handleDelete={() => promptDestroyLink(link.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal 
        actions={{
          submit: {
            text: 'Delete',
            callback: handleDestroyLinkSubmit,
            textColor: 'text-red-400 hover:text-red-500 focus:text-red-500',
            shadowColor: 'hover:shadow-red-400 dark:hover:shadow-red-400 hover:border-red-400 dark:hover:border-red-400 focus:shadow-red-400 dark:focus:shadow-red-400 focus:border-red-400 dark:focus:border-red-400',
          }, 
          cancel: {
            focus: true,
            text: 'Cancel',
            callback: handleDestroyLinkCancel,
          }
        }}
        title="Delete Link?"
        show={!!selectedLinkId}
        description="This action can't be reversed."
      />
    </div>
  );
};

const LinkRow = ({ link, handleDelete }: LinkRowProps) => {
  const { info } = useContext(ToastrContext) as ToastrContextType;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/l/${link.ln}`)
    info('Copied to clipboard.')
  }
  
  return (
    <tr className="border-b">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        <a 
          href={link.url}
          title={`Visit ${link.url}`}
          className="text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 hover:text-[#9333EA] focus:text-[#9333EA] dark:hover:text-[#9333EA] dark:focus:text-[#9333EA]"
        >
          {link.url}
        </a>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        { link.ln ? link.ln : "-" }
      </td>
      <td className="px-4 py-2  whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        <div title={link.protected ? 'Password protected' : 'Publicly available'}>
          {link.protected ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          )}
        </div>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        <span>
          {link.createdAt.toLocaleDateString()} {link.createdAt.toLocaleTimeString()}
        </span>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm flex">
        <button 
          onClick={handleCopy}
          title="Copy to clipboard"
          className="mr-2 flex items-center justify-center rounded-full btn-outline outline-none p-2 text-base font-normal text-gray-900 dark:text-white transition-colors duration-250 stroke-gray-900 dark:stroke-white hover:stroke-[#9333EA] dark:hover:stroke-[#9333EA]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="inherit" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        </button>
        
        <Link 
          passHref
          href={{
            pathname: '/links/[ln]',
            query: { ln: link.ln }
          }}
        >
          <a title="Edit link" className="mr-2 flex items-center justify-center rounded-full btn-outline p-2 outline-none text-gray-900 dark:text-white transition-colors duration-250 stroke-gray-900 dark:stroke-white hover:stroke-[#9333EA] dark:hover:stroke-[#9333EA]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="inherit" className="w-[.9rem] h-[.9rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </a>
        </Link>

        <button 
          title="Delete link"
          onClick={handleDelete}
          className="flex items-center justify-center rounded-full btn-outline outline-none p-2 text-base font-normal text-gray-900 dark:text-white transition-colors duration-250 stroke-red-500 hover:stroke-[#9333EA]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="inherit" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Links;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
