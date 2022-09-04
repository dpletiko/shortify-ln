import type { GetServerSideProps, NextPage } from "next";
import UpdateForm from "../../components/UpdateForm";
import { trpc } from "../../utils/trpc";

interface Props {
  id: string
}

const Link: NextPage<Props> = ({ id }) => {
  const { data, isSuccess, error } = trpc.useQuery(["link.getLinkById", { id }]);

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
  return {
    props: {
      id: ctx.params?.id as string
    }
  }
};
