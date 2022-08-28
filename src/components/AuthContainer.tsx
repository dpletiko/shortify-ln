import Image from "next/image";
import { signIn } from "next-auth/react";

type AuthProviderProps = {
  name: string;
  logo: string;
  provider: string;
};

const AuthContainer = () => {
  return (
    <div className="grid gap-3 pt-3 mt-10 text-center md:grid-cols-2 lg:w-2/3">
      <AuthProvider
        name="Google"
        provider="google"
        logo="/images/google.svg"
      />
      <AuthProvider
        name="Facebook"
        provider="facebook"
        logo="/images/facebook.svg"
      />
      <AuthProvider
        name="Instagram"
        provider="instagram"
        logo="/images/instagram.svg"
      />
      <AuthProvider
        name="GitHub"
        provider="github"
        logo="/images/github.svg"
      />
    </div>
  );
}

const AuthProvider = ({
  name,
  logo,
  provider,
}: AuthProviderProps) => {
  return (
    <button 
      onClick={() => signIn(provider)}
      className="flex flex-col items-center justify-center p-6 cursor-pointer duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-[1.025]"
    >
      <Image src={logo} alt={`${name} logo`} width="54" height="54" />
      <h2 className="mt-3 text-xl text-violet-500">
        Sign In with { name }
      </h2>
    </button>
  );
};

export default AuthContainer;