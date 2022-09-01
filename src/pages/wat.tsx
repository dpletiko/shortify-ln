import type { NextPage } from "next";
import Input from "../components/Input";

const Home: NextPage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className="mt-5 mb-9 text-center text-[4rem] md:text-[5rem] font-extrabold text-gray-700 mx-auto">
          Shortify - <span className="text-purple-300">ln</span>
        </h1>

        <h4 className="mt-5 mb-9 text-center text-lg md:text-[2rem] font-semibold text-gray-500 mx-auto">
          COULD IT BE <span className="text-purple-300 text-[1rem] md:text-[1.3rem]">SMALLER</span>?
        </h4>
      </div>
    </div>
  );
};

export default Home;