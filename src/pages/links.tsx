import { Link } from "@prisma/client";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

type LinkRowProps = {
  link: Link;
};

const Links: NextPage = () => {
  const links = trpc.useQuery(["link.getLinks"]);
  console.log(links)
  
  return (
    <div className="w-full">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-r border-gray-300">ID</th>
            <th className="border-b border-r border-gray-300">URL</th>
            <th className="border-b border-r border-gray-300">Short</th>
            <th className="border-b border-gray-300">Created At</th>
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
  );
};

const LinkRow = ({link}: LinkRowProps) => {
  return (
    <tr className="border-">
      <td className="p-2 border-b border-r border-gray-300 dark:text-gray-400">{link.id}</td>
      <td className="p-2 border-b border-r border-gray-300 dark:text-gray-400">{link.url}</td>
      <td className="p-2 border-b border-r border-gray-300 dark:text-gray-400">{link.ln || '-'}</td>
      <td className="p-2 border-b border-gray-300 dark:text-gray-400">{link.createdAt.toLocaleDateString()} {link.createdAt.toLocaleTimeString()}</td>
    </tr>
  );
}

export default Links;