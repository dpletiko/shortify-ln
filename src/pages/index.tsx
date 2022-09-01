import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Input from "../components/Input";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row ">
        <Input />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}