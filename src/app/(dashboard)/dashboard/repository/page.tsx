"use client";

import { RepositoryListSkeleton } from "@/components/repository/repository-list-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConnectRepository, useRepositories } from "@/hooks/query/repository";
import { cn } from "@/lib/utils";
import { ExternalLink, Search, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Repository {
    id: number,
    name: string,
    full_name: string,
    description: string | null,
    html_url: string,
    stargazers_count: number,
    language: string | null,
    topics?: string[],
    inConnected?: boolean
};

const Repository = () => {
    const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepositories();

    const { mutate: connectRepo } = useConnectRepository();

    const [localConnectingId, setLocalConnctingId] = useState<number | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {
                threshold: 0.1
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);



    const allRepository = data?.pages.flatMap(page => page) || [];

    const filteredRepositories = allRepository.filter((repo: Repository) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConnect = (repo: Repository) => {
        setLocalConnctingId(repo?.id);
        connectRepo({
            owner: repo.full_name.split("/")[0],
            githubId: repo?.id,
            repo: repo?.name
        }, {
            onSettled: () => {
                setLocalConnctingId(null);
            }
        })
    }

    if (isPending) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                        <p className="text-muted-foreground">Manage the view all your GitHub repository</p>
                    </div>
                    <RepositoryListSkeleton />
                </div>
            </div>
        )
    };

    if (isError) {
        return <div>Failed to load repository</div>
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                    <p className="text-muted-foreground">Manage and view your Github repositories</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search repository..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid gap-4">
                    {
                        filteredRepositories.map((repo: Repository) => (
                            <Card key={repo?.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>

                                    <div className="space-y-2 flex justify-between flex-1 w-full">
                                        <div className="flex items-start flex-col justify-between">
                                            <div className="flex items-center gap-2 w-full">
                                                <CardTitle className="text-lg">
                                                    {repo?.name}
                                                </CardTitle>
                                                <Button variant={"ghost"}>{repo?.language || "Unknow"}</Button>
                                                {repo.isConnected && <Button variant={"ghost"} className="rounded-2xl px-4 text-yellow-500 bg-yellow-400/10 hover:bg-yellow-400/50 hover:text-yellow-500">Connected</Button>}
                                            </div>
                                            <CardDescription>{repo.description}</CardDescription>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant={"ghost"} size={"icon"} asChild>
                                                <a href={repo.html_url} target="_blank" rel="noopener noreferre">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                onClick={() => handleConnect(repo)}
                                                disabled={localConnectingId === repo.id || repo.isConnected}
                                                variant={repo.isConnected ? "outline" : "default"}
                                            >
                                                {localConnectingId === repo.id ? "connecting..." : repo.isConnected ? "Connected" : "Connect"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-1">
                                        <Star size={18} className={cn("text-yellow-400", repo?.stargazers_count && "fill-yellow-400")} />
                                        <p>{repo?.stargazers_count ? repo.stargazers_count : 0}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>

            <div ref={observerTarget} className="py-4">
                {isFetchingNextPage && <RepositoryListSkeleton />}
                {
                    !hasNextPage && allRepository.length > 0 && (
                        <p className="text-center text-muted-foreground">No More Repository</p>
                    )
                }
            </div>

        </div>
    )
}

export default Repository;