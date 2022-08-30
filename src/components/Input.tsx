import { LinkControl } from "@prisma/client";
import React, { useContext, useState } from "react";
import { trpc } from "../utils/trpc";
import { ToastrContext, ToastrContextType } from "./Toastr";

type AclProps = {
  passwd: string,
  multi: boolean,
};
type AclElProps = {
  onSubmit(val: AclProps): void;
};


const Input = () => {
  const [url, setUrl] = useState("");
  const [linkProtected, setLinkProtected] = useState<boolean>(false);
  const [acl, setAcl] = useState<LinkControl[]>([]);
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;

  const linkMutation = trpc.useMutation(["link.create"], {
    onSuccess: () => {
      setUrl('')
      toastrSuccess('Link successfully shortened!')
    },
    onError: error => toastError(error.message)
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  };

  const handleLinkProtected = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked)
    setLinkProtected(e.target.checked)
  };

  const handleAcl = (val: AclProps) : void => {
    console.log(val)
  };

  const handleSubmit = async () => {
    if(!url.length) return

    try {
      const _url = new URL(url)
      if(!_url) throw new Error()
      
      linkMutation.mutate({ url: url })
    } catch(e: any) {
      console.log('error')
      setUrl('')
      toastError(`Invalid URL: \`${url}\``)
    }
    
    console.log(url)
  };

  return (
    <div className="w-full z-50">
      <div className="mb-5 rounded-lg flex flex-row transition-all duration-300 shadow-md focus-within:shadow-lg hover:shadow-lg dark:shadow-[#FFFFFF2B] dark:hover:shadow-[#FFFFFF2B] dark:focus-within:shadow-[#FFFFFF2B]">
        <input 
          type="text" 
          name="link" 
          value={url}
          autoComplete="off"
          onChange={e => handleChange(e)}
          className="p-6 rounded-lg w-full text-xl font-medium focus:outline-none dark:bg-transparent text-gray-400"
          placeholder="Type URL to shorten..." />


        <button 
          onClick={handleSubmit}
          className="px-4 py-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#9333EA" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </button>
      </div>

      <div className="flex p-1 mb-5">
        <div className="flex items-center h-5">
          <input 
            type="checkbox" 
            id="protected-checkbox"
            onChange={handleLinkProtected}
            aria-describedby="protected-checkbox-text" 
            className="w-4 h-4 text-[#9333EA] accent-[#9333EA] rounded-lg" />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="protected-checkbox" className="font-medium text-gray-700 dark:text-gray-400">
            Is URL password protected?
            <p id="protected-checkbox-text" className="text-xs font-normal text-gray-500">Define specific ACL for the shortened link.</p>
          </label>
        </div>
      </div>

      {
        linkProtected && (
          <div className="flex flex-col">
            <Acl 
              onSubmit={val => handleAcl(val)}
            />
          </div>
        )
      }
    </div>
  );
}

const Acl = ({
  onSubmit,
}: AclElProps) => {
  const [passwd, setPasswd] = useState<string>('');
  const [multi, setMulti] = useState<boolean>(true);


  return (
    <div className="flex flex-row align-center items-center gap-5">
      <div className="mb-5 rounded-lg flex flex-1 flex-row transition-all duration-300 shadow-md focus-within:shadow-lg hover:shadow-lg dark:shadow-[#FFFFFF2B] dark:hover:shadow-[#FFFFFF2B] dark:focus-within:shadow-[#FFFFFF2B]">
        <input 
          type="text" 
          value={passwd}
          autoComplete="off"
          onChange={e => setPasswd(e.target.value)}
          className="p-4 rounded-lg w-full text-base font-medium focus:outline-none dark:bg-transparent text-gray-400"
          placeholder="Add URL password" />


        <button 
          type="submit"
          className="px-4 py-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
      </div>

      <div className="flex p-1 mb-5">
          <div className="flex items-center h-5">
            <input 
              type="checkbox" 
              id="multi-checkbox"
              value={multi ? 'on' : 'off'}
              onChange={e => setMulti(e.target.checked)}
              aria-describedby="multi-checkbox-text" 
              className="w-4 h-4 text-[#9333EA] accent-[#9333EA] rounded-lg" />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="multi-checkbox" className="font-medium text-gray-700 dark:text-gray-400">
              Is ACL for multiple use?
              <p id="multi-checkbox-text" className="text-xs font-normal text-gray-500">Enable if password can be used more than once.</p>
            </label>
          </div>
        </div>
    </div>
  );
}

export default Input;