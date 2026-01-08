import { connectRepository, fetchRepositories } from "@/actions/repository";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRepositories = () => {
    return useInfiniteQuery({
        queryKey: ["repositories"],
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

export const useConnectRepository = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ owner, repo, githubId }: { owner: string, repo: string, githubId: number }) => await connectRepository(owner, repo, githubId),
        onSuccess: () => {
            toast.success("Repository connected successfully");
            queryClient.invalidateQueries({ queryKey: ["repositories"] })
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to connect repository");
        }
    })
};