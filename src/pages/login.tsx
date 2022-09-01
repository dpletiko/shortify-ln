import type { NextPage, GetServerSideProps } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders } from "next-auth/react";
import AuthContainer from "../components/AuthContainer";

interface Props {
  providers: Record<string, ClientSafeProvider>
}

const Login: NextPage<Props> = ({ providers }) => {
  return (
    <AuthContainer providers={providers} />
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