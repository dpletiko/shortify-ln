// src/components/Dialog.tsx
import { Fragment, useContext, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ThemeContext, ThemeContextType } from './Theme'

type FormDataEntries = {
  [k: string]: FormDataEntryValue
}

interface PromptProps {
  show: boolean,
  title: string,
  description?: string | undefined,

  children?: JSX.Element

  actions: {
    cancel: () => void,
    submit?: (data: FormDataEntries) => void
  },
}

const Prompt: React.FC<PromptProps> = ({ show, title, description, actions, children }: PromptProps) => {
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  const focusedButtonRef = useRef(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if(actions.submit === undefined) return;
    
    const _formData = new FormData(e.currentTarget)

    actions.submit(Object.fromEntries(_formData))
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className={`${theme} relative z-10`} initialFocus={focusedButtonRef} onClose={actions.cancel}>
        {<Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>}

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel 
                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <form onSubmit={handleSubmit}>
                  <div className="bg-white dark:bg-zinc-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300">
                          { title }
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-800 dark:text-gray-400">
                            { description }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {children}
                  </div>
                  <div className="p-4 mb-1 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="ml-3 px-4 inline-flex items-center justify-center rounded-full btn-outline outline-none p-2 text-base font-normal transition-all duration-250 text-gray-700 dark:text-gray-400 hover:dark:text-[#9333EA] focus:dark:text-[#9333EA] hover:shadow-[#9333EA] focus:shadow-[#9333EA] dark:hover:shadow-[#9333EA] dark:focus:shadow-[#9333EA] border-[#9333EA] dark:border-[#9333EA] hover:border-[#9333EA] dark:focus:border-[#9333EA]"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={actions.cancel}
                      className="ml-3 px-4 inline-flex items-center justify-center rounded-full btn-outline outline-none p-2 text-base font-normal transition-all duration-250 text-gray-700 dark:text-gray-400"
                      ref={focusedButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Prompt;

export type {
  FormDataEntries,
}