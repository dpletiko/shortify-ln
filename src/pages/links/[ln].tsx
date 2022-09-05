import type { GetServerSideProps, NextPage } from "next";
import UpdateForm from "../../components/UpdateForm";
import { trpc } from "../../utils/trpc";
import { linkRepository } from "../../server/db/redis";

interface Props {
  ln: string
}

const Link: NextPage<Props> = ({ ln }) => {
  const { data, isSuccess, error } = trpc.useQuery(["link.getLinkByLn", { ln }]);

  if (error) {
    return (
      <div>{error.message}</div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="flex flex-row">
          <UpdateForm 
            linkData={data}
          />
        </div>
      </div>
    );
  }

  return (
    <div>Loading...</div>
  );
}

export default Link;


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {  
  const getLink = await linkRepository.getLink(ctx.params?.ln as string)
  console.log(getLink)

  
  return {
    props: {
      ln: ctx.params?.ln as string
    }
  }
};
