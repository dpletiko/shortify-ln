import Head from "next/head";
import { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import Toastr, { ToastrProvider } from "./Toastr";

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <>
      <ToastrProvider>
        <Head>
          <title>Shortify - ln</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="w-screen flex flex-1 flex-col items-center min-h-screen isolate bg-white dark:bg-[#181818]">
          <Toastr />

          <h1 className="mt-5 mb-9 text-center text-[2rem] md:text-[5rem] font-extrabold text-gray-700 mx-auto">
            Shortify - <span className="text-purple-300">ln</span>
          </h1>

          <div className="w-screen pb-5 md:pb-8 flex-1 grid grid-cols-1 md:grid-cols-[14rem_1fr] lg:grid-cols-[14rem_1fr] xl:grid-cols-[20rem_minmax(900px,_1fr)_20rem]">
            <div className="order-last md:order-first relative" >
              <Sidebar />
            </div>

            <div className="px-6 md:px-9 flex flex-1 justify-center order-first md:order-last">
              {children}
            </div>
          </div>
        </main>
      </ToastrProvider>
    </>
  );
};

export default Layout;