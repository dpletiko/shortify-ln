import Head from "next/head";
import Navbar from "./Navbar";
import Toastr from "./Toastr";
import { PropsWithChildren, useContext } from "react";
import type { ThemeContextType} from "./Theme";
import { ThemeContext } from "./Theme";
import { Portal } from '@headlessui/react'

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  const { theme } = useContext(ThemeContext) as ThemeContextType;
  
  return (
    <div className={theme}>
      <Head>
        <title>Shortify - ln</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center min-h-screen isolate bg-white dark:bg-[#181A21]">
        <Navbar className="bg-white dark:bg-[#181A21]" />

        <div className="pt-[2rem] md:pt-[3rem] w-full pb-5 md:pb-8 flex flex-1">
          <div className="container mx-auto px-6 md:px-9 flex flex-1 justify-center order-first md:order-last">
            {children}
          </div>
        </div>

        <Portal>
          <div className={theme}>
            <Toastr />
          </div>
        </Portal>
      </main>
    </div>
  );
};

export default Layout;