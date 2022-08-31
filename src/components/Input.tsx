import { LinkControl } from "@prisma/client";
import React, { useContext, useState } from "react";
import { isValidURL } from "../utils/helpers";
import { trpc } from "../utils/trpc";
import { ToastrContext, ToastrContextType } from "./Toastr";

type AclProps = {
  passwd: string,
  multi: boolean,
};
type AclElProps = {
  enabled: boolean,
  onSubmit(val: AclProps): void;
};

type LinkData = {
  url: string,
  acl: AclProps[],
  protected: boolean,
  // ln: string | null,
}

const INITIAL_LINK_DATA: LinkData = {
  url: '',
  acl: [],
  protected: false,
}

const Input = () => {
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;

  const [link, setLink] = useState<LinkData>({...INITIAL_LINK_DATA})

  const linkMutation = trpc.useMutation(["link.create"], {
    onSuccess: () => {
      setLink(() => ({...INITIAL_LINK_DATA}))
      toastrSuccess('Link successfully shortened!')
    },
    onError: error => toastError(error.message)
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setUrl(e.target.value)
    setLink(l => ({...l, url: e.target.value }))
  };

  const handleLinkProtected = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setLinkProtected(e.target.checked)
    setLink(l => ({...l, protected: e.target.checked }))
  };

  const handleAcl = (val: AclProps) : void => {
    console.log(val)
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if(!link.url.length) 
        throw new Error('Invalid URL')

      if(!isValidURL(link.url)) 
        throw new Error(`Invalid URL: \`${link.url}\``)
      
      linkMutation.mutate(link)
    } catch(e: any) {
      console.log(e)
      toastError(e.message)
      setLink(l => ({ ...l, url: '' }))
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-5 flex flex-row transition-all duration-300 rounded-lg shadowed-container">
        <input 
          type="text" 
          name="url" 
          value={link.url}
          autoComplete="off"
          onChange={e => handleUrlChange(e)}
          className="p-4 rounded-lg w-full text-xl font-medium focus:outline-none dark:bg-transparent text-gray-400"
          placeholder="Type URL to shorten..." />


        <button 
          type="submit"
          className="px-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#9333EA" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </button>
      </div>

      <div className="flex p-1 mb-5">
        <div className="flex items-center h-5">
          <input 
            type="checkbox" 
            name="protected"
            id="protected-checkbox"
            checked={link.protected}
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


      <div className="flex flex-col">
        <Acl 
          enabled={link.protected}
          onSubmit={val => handleAcl(val)}
        />
      </div>
    </form>
  );
}

const Acl = ({
  enabled,
  onSubmit,
}: AclElProps) => {
  const [passwd, setPasswd] = useState<string>('');
  const [multi, setMulti] = useState<boolean>(true);

  return (
    <div className={`flex flex-row align-center items-center gap-5 transition-all duration-300 ${enabled ? 'opacity-1' : 'opacity-0'}`}>
      <div className="flex flex-1 flex-row transition-all duration-300 rounded-lg shadowed-container">
        <input 
          type="text" 
          value={passwd}
          autoComplete="off"
          onChange={e => setPasswd(e.target.value)}
          className="px-4 py-3 rounded-lg w-full text-base font-medium focus:outline-none dark:bg-transparent text-gray-400"
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

      <div className="flex p-1">
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