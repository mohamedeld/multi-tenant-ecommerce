import { getQueryClient, trpc } from "@/trpc/server";


const HomePage =async  () => {
  const queryClient = getQueryClient();
  const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());
  const session = await queryClient.fetchQuery(trpc.auth.session.queryOptions());
  return (
    <div>
      {JSON.stringify(session,null,2)}
    </div>
  )
}

export default HomePage