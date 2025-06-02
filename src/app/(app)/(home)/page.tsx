import { getQueryClient, trpc } from "@/trpc/server";


const HomePage =async  () => {
  const queryClient = getQueryClient();
  const categories = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div>
      {JSON.stringify(categories,null,2)}
    </div>
  )
}

export default HomePage