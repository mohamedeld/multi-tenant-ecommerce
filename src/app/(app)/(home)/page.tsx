import {  getQueryClient, trpc } from "@/trpc/server";


const HomePage =async  () => {
  const queryClient = getQueryClient();
  const {user} = await queryClient.fetchQuery(trpc.auth.session.queryOptions());
  return (
    <div>
      {JSON.stringify(user,null,2)}
    </div>
  )
}

export default HomePage