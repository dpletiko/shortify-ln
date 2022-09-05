import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { DefaultUser } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import NavLink from "./NavLink";
import { ThemeColor, ThemeContext, ThemeContextType } from "./Theme";

type UserDataProps = {
  user: DefaultUser;
};

const Navbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const { status } = useSession();
  const [menuOpen, toggleMenu] = useState<boolean>(false)

  const handleToggleMenu = () => toggleMenu(v => !v)

  if(status !== 'authenticated') {
    return (
      <nav className="relative shadow-xl dark:shadow-white/5 bg-transparent dark:bg-white/5">
        <div className="lg:container mx-auto flex flex-wrap justify-between items-center px-2 sm:px-4 py-2.5">
          <NavLink activeClassName="nav-link-active" passHref href="/">
            <a className="flex items-center">
              <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
                Shortify - <span className="text-purple-300">ln</span>
              </span>
            </a>
          </NavLink>
          <div className="p-5 md:p-9"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="relative shadow-xl dark:shadow-white/5 bg-transparent dark:bg-white/5">
      <div className="lg:container mx-auto flex flex-wrap justify-between items-center px-2 sm:px-4 py-2.5">
        <Link passHref href="/">
          <a className="flex items-center">
            <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
              Shortify - <span className="text-purple-300">ln</span>
            </span>
          </a>
        </Link>

        <div className="w-full hidden md:block md:w-auto overflow-hidden">
          <NavbarList />
        </div>

        <button
          type="button"
          onClick={handleToggleMenu}
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden btn-shadow-interactive"
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>

      <div className={`-z-10 w-full md:hidden absolute left-0 bottom-0 origin-bottom ${menuOpen ? 'translate-y-[100%]' : ' -translate-y-[100%]'} transition-all duration-300 ease-in-out bg-white dark:bg-[#181818]`}>
        <NavbarList />
      </div>
    </nav>
  );
};

const ThemeToggler = () => {
  const { theme, toggle } = useContext(ThemeContext) as ThemeContextType;

  return (
    <button 
      onClick={toggle}
      title={`Toggle ${theme} mode`}
      className={`w-full flex p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl ${theme === ThemeColor.Dark ? 'stroke-white' : 'stroke-gray-900'} hover:stroke-[#9333EA]`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="inherit" className={`w-6 h-6`}>
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d={
            theme === ThemeColor.Dark 
              ? "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              : "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          } 
        />
      </svg>
    </button>
  );
}

const NavbarList = () => {
  return (
    <ul className="flex p-4 flex-col shadow-sm shadow-[#FFFFFF2B] md:flex-row md:space-x-8 md:text-sm md:font-medium md:shadow-none">
      <li>
        <ThemeToggler />
      </li>
      <li>
        <NavLink activeClassName="nav-link-active text-[#9333EA] dark:text-[#9333EA]" passHref href="/">
          <a 
            className="flex p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:text-[#9333EA]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-gray-900 dark:stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>

            <span className="ml-2 whitespace-nowrap">Home</span>
          </a>
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="nav-link-active text-[#9333EA] dark:text-[#9333EA]" passHref href="/links">
          <a 
            className="flex p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:text-[#9333EA]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-gray-900 dark:stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>

            <span className="ml-2 whitespace-nowrap">My Links</span>
          </a>
        </NavLink>
      </li>
      <li>
        <button 
          onClick={() => signOut()}
          className="w-full flex p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg transition-colors duration-250 drop-shadow-md hover:drop-shadow-xl hover:text-[#9333EA]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-gray-900 dark:stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="ml-2 whitespace-nowrap">Sign Out</span>
        </button>
      </li>
    </ul>
  );
}

const UserAvatar = ({ user }: UserDataProps) => {
  if (user.image)
    return (
      <div className="flex flex-col justify-start">
        <div className="rounded-full ml-3 md:ml-4 mr-auto mb-4 bg-gradient-to-r p-[4px] from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
          <div className="flex flex-col h-full bg-white text-white rounded-full p-[1px]">
            <Image alt="" width="64" height="64" src={user.image} className="rounded-full" />
          </div>
        </div>
        <p className="font-semibold text-xl text-gray-900 dark:text-white text-center">{user.name}</p>
      </div>
    );

  return (
    <div className="overflow-hidden relative w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-600">
      <svg className="absolute -left-1 w-12 h-12 text-gray-400 dark:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
      </svg>
    </div>
  );
};

export default Navbar;
