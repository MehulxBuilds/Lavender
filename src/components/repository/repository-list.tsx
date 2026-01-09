"use client";

import { useDisconnectAllRepositories, useDisconnectRepositories, useGetAllConnectedRepositories } from '@/hooks/query/repository';
import { useDisconnectAllRepoState } from '@/store/repository';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';

const RepositoryList = () => {
    const { disconnectAllOpen, setDisconnectAllOpen } = useDisconnectAllRepoState();
    const { mutate: disconnectAllRepoMutate, isPending: isDisconnectAllRepoPending } = useDisconnectAllRepositories();
    const { mutate: disconnectRepoMutate, isPending: isDisconnectRepoPending } = useDisconnectRepositories();
    const { data: repositories, isPending } = useGetAllConnectedRepositories();

    if (isPending) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>Manage your connected GitHub repositories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-20 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Connected Repositories</CardTitle>
                        <CardDescription>Manage your connected Github repositories</CardDescription>
                    </div>
                    {repositories && repositories.length > 0 && (
                        <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Disconnect All
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                        Disconnect All Repositories?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will disconnect all {repositories.length} repositories and delete all associated AI reviews.
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => disconnectAllRepoMutate()}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isDisconnectAllRepoPending}
                                    >
                                        {isDisconnectAllRepoPending ? "Disconnecting..." : "Disconnect All"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {!repositories || repositories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No repositories connected yet.</p>
                        <p className="text-sm mt-2">
                            Connect repositories from the Repository page.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {repositories.map((repo) => (
                            <div
                                key={repo.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold truncate">{repo.fullName}</h3>
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Disconnect Repository?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will disconnect <strong>{repo.fullName}</strong> and delete
                                                all associated AI reviews.
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => disconnectRepoMutate(repo.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={isDisconnectRepoPending}
                                            >
                                                {isDisconnectRepoPending ? "Disconnecting..." : "Disconnect"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
};

export default RepositoryList;