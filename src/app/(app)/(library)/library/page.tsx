import LibraryView from "@/modules/library/ui/views/LibraryView"
import { LIMIT } from "@/modules/tags/constants";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const LibraryPage = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.library.getMany.infiniteQueryOptions({
        limit:LIMIT
    }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <LibraryView/>
    </HydrationBoundary>
        
  )
}

export default LibraryPage