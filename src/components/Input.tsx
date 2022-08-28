import { LinkControl } from "@prisma/client";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";


type ErrorContainerProps = {
  children: JSX.Element | JSX.Element[];
};
type ErrorProps = {
  message: string;
  onClose: CallableFunction;
};

type AclProps = {
  passwd: string,
  multi: boolean,
};
type AclElProps = {
  onSubmit(val: AclProps): void;
};


const Input = () => {
  const linkMutation = trpc.useMutation(["link.create"]);
  const [url, setUrl] = useState("");
  const [linkProtected, setLinkProtected] = useState<boolean>(false);
  const [acl, setAcl] = useState<LinkControl[]>([]);

  const [error, setError] = useState<string|null>(null);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
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

    setError(null)

    try {
      const _url = new URL(url)
      if(_url) linkMutation.mutate({ url: url})
    } catch(e: any) {
      console.log('error')
      setUrl('')
      setError(`Invalid URL: \`${url}\``)
    }
    
    console.log(url)
  };

  return (
    <div className="w-full z-50">
      {url}
      <form id="shorten-form" onSubmit={handleSubmit}>
        <div className="mb-5 rounded-lg flex flex-row shadow-md focus-within:shadow-xl hover:shadow-xl">
          <input 
            type="text" 
            name="link" 
            value={url}
            autoComplete="off"
            onChange={e => handleChange(e)}
            className="p-6 rounded-lg w-full text-xl font-medium focus:outline-none"
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
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded-lg border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="protected-checkbox" className="font-medium text-gray-700">Is URL protecred?</label>
            <p id="protected-checkbox-text" className="text-xs font-normal text-gray-500">Define specific ACL for the shortened link.</p>
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

      </form>

      { error && 
        <ErrorContainer>
          <Error message={error} onClose={() => setError(null) } />
        </ErrorContainer>
      }
    </div>
  );
}

const ErrorContainer = ({children}: ErrorContainerProps) => {
  return (
    <div className="absolute -z-10 top-0 left-0 right-0 min-h-screen min-w-screen font-semibold text-lg text-red-600 px-4">
      {children}
    </div>
  );
}

const Error = ({message, onClose}: ErrorProps) => {
  return (
    <div id="toast-default" className="bottom-3 right-3 absolute flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-red-800 dark:text-blue-200">
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
        data-dismiss-target="#toast-default" 
        aria-label="Close"
        onClick={() => onClose()}
      >
        <span className="sr-only">Close</span>
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
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
      <div className="mb-5 rounded-lg flex flex-1 flex-row shadow-md focus-within:shadow-xl hover:shadow-xl transition-all duration-150">
        <input 
          type="text" 
          value={passwd}
          autoComplete="off"
          onChange={e => setPasswd(e.target.value)}
          className="p-4 rounded-lg w-full text-base font-medium focus:outline-none"
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
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded-lg border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="multi-checkbox" className="font-medium text-gray-700">Is ACL for multiple use?</label>
            <p id="multi-checkbox-text" className="text-xs font-normal text-gray-500">Enable if password can be used more than once.</p>
          </div>
        </div>
    </div>
  );
}

export default Input;