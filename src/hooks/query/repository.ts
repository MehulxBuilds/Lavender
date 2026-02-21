"use client";

import { connectRepository, fetchRepositories } from "@/actions/repository";
import { disconnectAllRepository, disconnectRepository, getConnectedRepositories } from "@/actions/settings";
import { useDisconnectAllRepoState } from "@/store/repository";
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

export const useGetAllConnectedRepositories = () => {
    return useQuery({
        queryKey: ['connected-repository'],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    })
};

export const useDisconnectRepositories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (repositoryId: string) => await disconnectRepository(repositoryId),
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repository"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                toast.success("Repository disconnected successfully");
            } else {
                toast.error(result.error || "Failed to disconnect repository");
            }
        }
    })
};

export const useDisconnectAllRepositories = () => {
    const queryClient = useQueryClient();
    const { setDisconnectAllOpen } = useDisconnectAllRepoState();

    return useMutation({
        mutationFn: async () => await disconnectAllRepository(),
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repository"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                toast.success(`${result?.count} Repository disconnected successfully`);
                setDisconnectAllOpen(false);
            } else {
                toast.error(result.error || "Failed to disconnect repositories");
            }
        }
    })
};