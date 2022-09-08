import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { isValidURL } from "../utils/helpers";
import { trpc } from "../utils/trpc";
import { ToastrContext, ToastrContextType } from "./Toastr";

type AclProps = {
  id?: string,
  passwd: string,
  multi: boolean,
};
type AclElProps = {
  i: number,
  acl: AclProps;
  onRemove(): void;
  onChange(val: AclProps): void;
};
type AclContainerProps = {
  acl: AclProps[],
  enabled: boolean,
  handleNew(): void;
  handleRemove(i: number): void;
  handleChange(i: number, val: AclProps): void;
};

type FormProps = {
  linkData?: LinkData
}

type LinkData = {
  id?: string,
  url: string,
  acl: AclProps[],
  protected: boolean,
  ln?: string,
}

const INITIAL_ACL_DATA: AclProps = {
  multi: true,
  passwd: ''
};
const INITIAL_LINK_DATA: LinkData = {
  url: '',
  acl: [{...INITIAL_ACL_DATA}],
  protected: false,
}

const useForm = (linkData: LinkData = {...INITIAL_LINK_DATA}) => {
  const { error: toastError, success: toastrSuccess } = useContext(ToastrContext) as ToastrContextType;
  
  const [link, setLink] = useState<LinkData>({...linkData})

  const [createdLink, setCreatedLink] = useState<LinkData|undefined>(linkData.id === undefined ? undefined : linkData)
  
  const linkMutation = trpc.useMutation([
      linkData.id === undefined 
        ? "link.create"
        : "link.update"
    ], {
    onSuccess: (newLink) => {
      console.log(newLink)
      setCreatedLink(newLink)
      
      if(link.id === undefined) {
        setLink(() => ({...INITIAL_LINK_DATA}))
        toastrSuccess('Link successfully shortened!')
      } else {
        setLink(() => newLink.acl.length !== 0 
          ? ({ ...newLink })
          : ({ ...newLink, acl: [{...INITIAL_ACL_DATA}] })
        )
        toastrSuccess('Link successfully updated!')
      }
    },
    onError: error => toastError(error.message)
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(l => ({...l, url: e.target.value }))
  };

  const handleLinkProtected = (checked: boolean) => {
    if(checked && !link.acl.length) {
      setLink(l => ({ ...l, acl: [{...INITIAL_ACL_DATA}] }))
    }
    
    setLink(l => ({ ...l, protected: checked }))
  };

  const addNewAcl = () : void => {
    setLink(l => ({...l, acl: [...l.acl, {...INITIAL_ACL_DATA}]}))
  };
  const handleAclChange = (i: number, val: AclProps) : void => {
    setLink(l => ({
      ...l, 
      acl: [
        ...l.acl.map((ac, index) => index === i ? val : ac)
      ]
    }))
  };
  const removeAcl = (i: number) : void => {
    if(link.acl.length > 1) {
      setLink(l => ({...l, acl: l.acl.filter((val, index) => index !== i)}))
      return;
    }

    handleLinkProtected(false)
    setLink(l => ({...l, acl: [{...INITIAL_ACL_DATA}]}))
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if(!link.url.length) 
        throw new Error('Invalid URL')

      if(!isValidURL(link.url)) 
        throw new Error(`Invalid URL: \`${link.url}\``)
    
      const _acl = link.protected 
        ? link.acl.reduce((acc: AclProps[], curr: AclProps) => {
          if(curr.passwd.trim().length) {
            return [...acc, curr]
          }
    
          return acc
        }, [])
        : []

      // Reduce empty acls
      linkMutation.mutate({
        ...link,
        acl: _acl,
        protected: link.protected && Boolean(_acl.length)
      })
      // linkMutation.mutate(link)
    } catch(e: any) {
      toastError(e.message)
      setLink(l => ({ ...l, url: '' }))
    }
  };

  return {
    link,
    addNewAcl,
    removeAcl,
    handleUrlChange,
    handleAclChange,
    handleLinkProtected,
    
    handleSubmit,

    createdLink
  }
}

const Form = ({ linkData = INITIAL_LINK_DATA }: FormProps) => {
  const { 
    link,
    addNewAcl,
    removeAcl,
    handleUrlChange,
    handleAclChange,
    handleLinkProtected,
    
    handleSubmit,  
    createdLink,
  } = useForm(linkData)

  const router = useRouter()
  console.log(router)

  const displayShortenLink = () => {
    if(createdLink === undefined || createdLink.ln === undefined) return (<></>);

    return `${window.location.origin}/${createdLink.ln}`
  }

  return (
    <div className="w-full">
      <div className="flex flex-1 items-center justify-center text-green-700 font-bold text-3xl transition-all duration-150 mb-9">
        {displayShortenLink()}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-5 group flex flex-row transition-all duration-300 rounded-lg shadowed-container">
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
            title="Shorten!"
            className="px-4 outline-none text-[#9333EA] stroke-[#9333EA] hover:animate-pulse focus:animate-pulse group-focus:animate-pulse group-focus-within:animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="inherit" className="w-8 h-8">
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
              aria-describedby="protected-checkbox-text" 
              onChange={({target: {checked}}) => handleLinkProtected(checked)}
              className="w-4 h-4 text-[#9333EA] accent-[#9333EA] rounded-lg" />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="protected-checkbox" className="font-medium text-gray-700 dark:text-gray-400">
              Is URL password protected?
              <p id="protected-checkbox-text" className="text-xs font-normal text-gray-500">Define specific ACL for the shortened link.</p>
            </label>
          </div>
        </div>

        <AclContainer 
          acl={link.acl}
          enabled={link.protected}
          handleNew={addNewAcl}
          handleRemove={removeAcl}
          handleChange={handleAclChange}
        />
      </form>
    </div>
  );
}

const AclContainer = ({
  acl,
  enabled,
  handleNew, 
  handleChange,
  handleRemove,
}: AclContainerProps) => {
  if(!enabled) <></>;
  
  const onChange = (i: number, ctrl: AclProps) => {
    // TODO: maybe debounce
    handleChange(i, ctrl)
  }

  return (
    <div className={`mb-5 flex flex-col gap-5 transition-all duration-300 ${enabled ? 'opacity-1' : 'opacity-0'}`}>
      <div className="flex flex-col gap-5 transition-all duration-300">
        {acl.map((ctrl, i) => (
          <Acl 
            i={i}
            key={i}
            acl={ctrl}
            onRemove={() => handleRemove(i)}
            onChange={(acl) => onChange(i, acl)}
          />
        ))}
      </div>

      <button 
        type="button"
        onClick={handleNew}
        className="px-4 py-[.35rem] transition-all duration-150 shadowed-container btn-shadow-interactive w-auto flex self-start items-center rounded-lg text-xs font-medium text-gray-700 dark:text-gray-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>New ACL</span>
      </button>
    </div>
  );
}

const Acl = ({
  i,
  acl,
  onChange,
  onRemove,
}: AclElProps) => {

  return (
    <div className="flex flex-1 flex-row items-center gap-5 transition-all duration-300">
      <div className="flex flex-1 flex-row transition-all duration-300 rounded-lg shadowed-container">
        <input 
          type="text" 
          value={acl.passwd}
          autoComplete="off"
          placeholder="Add URL password"
          onChange={({target: {value}}) => onChange(({...acl, passwd: value}))}
          className="px-4 py-3 rounded-lg w-full text-base font-medium focus:outline-none dark:bg-transparent text-gray-400" />


        <button 
          type="button"
          title="Remove ACL"
          className="px-4 py-3"
          onClick={onRemove}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 stroke-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex p-1">
        <div className="flex items-center h-5">
          <input 
            type="checkbox" 
            id={`multi-checkbox-${i}`}
            checked={acl.multi}
            value={acl.multi ? 'on' : 'off'}
            aria-describedby={`multi-checkbox-text-${i}`} 
            className="w-4 h-4 text-[#9333EA] accent-[#9333EA] rounded-lg" 
            onChange={({target: {checked}}) => onChange(({...acl, multi: checked}))} />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor={`multi-checkbox-${i}`} className="font-medium text-gray-700 dark:text-gray-400">
            Is ACL for multiple use?
            <p id={`multi-checkbox-text-${i}`} className="text-xs font-normal text-gray-500">Enable if password can be used more than once.</p>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Form;