import { fetchRepositories } from "@/actions/repository";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useRepositories = () => {
    return useInfiniteQuery({
        queryKey: ["repository"],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await fetchRepositories(pageParam, 10);
            return data;
        },
        getNextPageParam: (lastpage, allpages) => {
            if (lastpage.length < 10) return undefined;
            return allpages.length + 1
        },
        initialPageParam: 1
    })
};