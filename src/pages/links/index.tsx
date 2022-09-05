import { trpc } from "../../utils/trpc";
import { Link as dbLink } from "@prisma/client";
import { getSession } from "next-auth/react";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

type LinkRowProps = {
  link: dbLink;
};

const Links: NextPage = () => {
  const links = trpc.useQuery(["link.getLinks"]);

  return (
    <div className="w-full">
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

                {links.isSuccess && links.data.map((link) => <LinkRow key={link.id} link={link} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkRow = ({ link }: LinkRowProps) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        <a 
          href={link.url}
          title={`Visit ${link.url}`}
          className="flex text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:text-[#9333EA] focus:text-[#9333EA] dark:hover:text-[#9333EA] dark:focus:text-[#9333EA]"
        >
          {link.url}
        </a>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
      {link.ln ? (
        <Link 
          passHref 
          href={{
            pathname: 'ln/[ln]',
            query: { ln: link.ln }
          }}
        >
          <a 
            title={`Visit ${link.ln}`}
            className="flex text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:text-[#9333EA] focus:text-[#9333EA] dark:hover:text-[#9333EA] dark:focus:text-[#9333EA]"
          >
            {link.ln}
          </a>
        </Link>
      ) : (
        "-"
      )}
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
        <Link 
          passHref
          href={{
            pathname: '/links/[id]',
            query: { id: link.id }
          }}
          type="button"
          title="Expand row"
        >
          <a className="rounded-full btn-outline px-5 py-2 outline-none text-gray-900 dark:text-white flex flex-row items-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[.9rem] h-[.9rem] mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            <span>Edit</span>
          </a>
        </Link>
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
