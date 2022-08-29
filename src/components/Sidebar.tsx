import Image from "next/image";
import { trpc } from "../utils/trpc";
import { DefaultUser } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

type UserDataProps = {
  user: DefaultUser;
};

const Sidebar = () => {
  const session = trpc.useQuery(["auth.getSession", ]);

  if(session.isSuccess)
    return (
      <aside className="w-80 flex flex-col align-bottom items-center justify-end" aria-label="Sidebar">
        <div className="overflow-y-auto py-4 px-3 mb-3 rounded">
          <ul className="space-y-2">
            <li>
              <Link href="/">
                <a 
                  className="flex items-center px-4 py-2 text-base font-normal text-gray-900 rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:bg-gray-100 hover:font-medium hover:text-[#9333EA] stroke-gray-700 hover:stroke-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                  </svg>

                  <span className="ml-2 whitespace-nowrap">Home</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="links">
                <a 
                  className="flex items-center px-4 py-2 text-base font-normal text-gray-900 rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:bg-gray-100 hover:font-medium hover:text-[#9333EA] stroke-gray-700 hover:stroke-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>

                  <span className="ml-2 whitespace-nowrap">My Links</span>
                </a>
              </Link>
            </li>
            <li>
              <button 
                onClick={() => signOut()}
                className="flex items-center px-4 py-2 text-base font-normal text-gray-900 rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:bg-gray-100 hover:font-medium hover:text-[#9333EA] stroke-gray-700 hover:stroke-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 stroke-inherit">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span className="flex-1 ml-2 whitespace-nowrap">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>

        <UserAvatar user={session.data.user}/>
      </aside>
    );

    return (
      <aside className="w-96 flex flex-col align-bottom items-center justify-end" aria-label="Sidebar"></aside>
    );
}

const UserAvatar = ({user}: UserDataProps) => {
  if(user.image)
    return (
      <div className="flex flex-col">
        <div className="rounded-full mx-auto mb-4 bg-gradient-to-r p-[4px] from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
          <div className="relative flex flex-col justify-between h-full bg-white text-white rounded-full p-[8px]">
            <Image 
                width="64"
                height="64"
                className="rounded-full" src={user.image} alt="" />

            <span 
              className="absolute top-0 right-0 transform -translate-y-1/4  w-5 h-5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
            ></span>
          </div>
        </div>
        <p className="font-semibold text-xl text-gray-900 text-center">{user.name}</p>
      </div>
    );

  return (
    <div className="overflow-hidden relative w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600">
        <svg className="absolute -left-1 w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
    </div>
  );
};


export default Sidebar;