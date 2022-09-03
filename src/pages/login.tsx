import type { NextPage, GetServerSideProps } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders } from "next-auth/react";
import AuthContainer from "../components/AuthContainer";

interface Props {
  providers: Record<string, ClientSafeProvider>
}

const Login: NextPage<Props> = ({ providers }) => {
  return (
    <div className="flex flex-1 items-start justify-center">
      <AuthContainer providers={providers} />
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}