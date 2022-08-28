import type { NextPage } from "next";
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