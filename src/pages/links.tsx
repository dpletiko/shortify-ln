import { Link } from "@prisma/client";
import type { NextPage } from "next";
import loadConfig from "next/dist/server/config";
import { trpc } from "../utils/trpc";

type LinkRowProps = {
  link: Link;
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
                  {/* <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left">
                    #
                  </th> */}
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left">
                    URL
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left">
                    Short
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.isError && (
                  <tr>
                    <td colSpan={4}>Unable to get data.</td>
                  </tr>
                )}

                {links.isSuccess && links.data.map(link => <LinkRow key={link.id} link={link} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkRow = ({link}: LinkRowProps) => {
  return (
    <tr className="border-b">
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white/95">
        {link.id}
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        {link.url}
        </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        {link.ln || '-'}
        </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-white/95">
        <span>{link.createdAt.toLocaleDateString()} {link.createdAt.toLocaleTimeString()}</span>
      </td>
    </tr>
  );
}

export default Links;