import { createContext, useContext, useState, PropsWithChildren } from "react";
import { v4 as uuidv4 } from 'uuid'

enum ToastType {
  Info = "info",
  Error = "error",
  Success = "success",
}

type ToastContent = {
  title: string,
  subtitle?: string
} | string;

type ToastrContextType = {
  toasts: Toast[],
  info: (content: ToastContent) => void
  error: (content: ToastContent) => void
  success: (content: ToastContent) => void
};
interface Toast {
  id: string;
  type: ToastType;
  content: ToastContent;
  clear: CallableFunction
}
type ToastProps = {
  toast: Toast;
  index: number;
  onClose: CallableFunction;
};

const ToastrContext = createContext<ToastrContextType | null>(null);

const ToastrProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToast] = useState<Toast[]>([]);

  const _addToast = (content: ToastContent, type: ToastType) => {
    const id = uuidv4()
    setToast(t => [...t, {
      id,
      type,
      content,
      clear: (id: string): void => _handleClose(id)
    }])

    setTimeout(() => _handleClose(id), 3000)
  }

  const _handleClose = (id: string) => setToast((_t) => [..._t.filter((t) => t.id !== id)]);

  const error = (content: ToastContent) => 
    _addToast(content, ToastType.Error)

  const info = (content: ToastContent) => 
    _addToast(content, ToastType.Info)

  const success = (content: ToastContent) => 
    _addToast(content, ToastType.Success)


  return <ToastrContext.Provider value={{ toasts, info, error, success }}>{children}</ToastrContext.Provider>;
};

const Toastr = () => {
  const { toasts } = useContext(ToastrContext) as ToastrContextType;
  return (
    <>
      {toasts && toasts.map((t, i) => (
        <Toast 
          index={i}
          key={t.id} 
          toast={t} 
          onClose={t.clear} />
      ))}
    </>
  );
};

const Toast = ({ toast: { id, content, type, clear }, index }: ToastProps) => {
  const color = type === ToastType.Error 
    ? 'bg-red-800'
    : type === ToastType.Success
      ? 'bg-green-800'
      : 'bg-blue-800'

  const _title = () => (
    <div className="text-sm font-semibold">
      {typeof content === 'string' ? content : content.title}
    </div>
  )
    
  const _subtitle = () => 
    typeof content === 'string' ? <></> : <div className="text-xs font-medium mt-1">{content.subtitle}</div>

  return (
    <div 
      id={`toast-${id}`} 
      style={{
        bottom: `calc(1rem + (${(index) * 76}px))`
      }}
      className="z-10 right-5 absolute flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transition-all duration-500" 
    >
      <div className={`mr-3 inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg text-blue-200 ${color}`}>
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
     
      <div className="flex flex-col w-full">
        { _title() }
      
        { _subtitle() }
      </div>
      
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Close"
        onClick={() => clear(id)}
      >
        <span className="sr-only">Close</span>
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Toastr;

export {
  ToastrContext,
  ToastrProvider
}

export type {
  Toast,
  ToastType,
  ToastProps,
  ToastrContextType
}