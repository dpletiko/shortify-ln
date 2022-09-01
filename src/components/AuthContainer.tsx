import Image from "next/image";
import { signIn } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react";

type AuthProviderProps = {
  provider: ClientSafeProvider;
};

interface AuthProps {
  providers: Record<string, ClientSafeProvider>
}

const AuthContainer: React.FC<AuthProps> = ({ providers }) => {
  return (
    <div className="grid gap-3 pt-3 mt-10 text-center md:grid-cols-2 lg:w-2/3">
      {Object.values(providers).map(provider => (
        <AuthProvider
          key={`provider-${provider.name}`}
          provider={provider}
        />
      ))}
    </div>
  );
}

const AuthProvider = ({
  provider,
}: AuthProviderProps) => {
  return (
    <button 
      onClick={() => signIn(provider.id, { callbackUrl: '/' })}
      className="flex flex-col items-center justify-center p-6 cursor-pointer duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-[1.025]"
    >
      <Image src={`/images/${provider.id}.svg`} alt={`${provider.name} logo`} width="54" height="54" />
      <h2 className="mt-3 text-xl text-violet-500">
        Sign In with { provider.name }
      </h2>
    </button>
  );
};

export default AuthContainer;
