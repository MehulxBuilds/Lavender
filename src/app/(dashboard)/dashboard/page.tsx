"use client";

import ContributionGraph from "@/components/dashboard/contribution-graph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardStats, useMonthlyActivity } from "@/hooks/query/dashboard";
import { GitBranch } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
    const { data: stats, isPending: isPendingStats } = useDashboardStats();
    const { data: monthlyActivity, isPending: isPendingActivity } = useMonthlyActivity();

    console.log(monthlyActivity)

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your coding activity and AI reviews</p>
            </div>

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-2xl font-bold">{isPendingStats ? "..." : (stats?.totalRepos || 0).toLocaleString()} </div>
                            <p className="text-xs text-muted-foreground">In the last year</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-2xl font-bold">{isPendingStats ? "..." : (stats?.totalCommits) || 0} </div>
                            <p className="text-xs text-muted-foreground">In the last year</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pull Request</CardTitle>
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-2xl font-bold">{isPendingStats ? "..." : (stats?.totalPRs) || 0} </div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-2xl font-bold">{isPendingStats ? "..." : (stats?.totalReviews) || 0} </div>
                            <p className="text-xs text-muted-foreground">Generated Reviews</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contribution Activity</CardTitle>
                    <CardDescription>Visualizing your coding frequency over the last year</CardDescription>
                </CardHeader>
                <CardContent>
                    <ContributionGraph />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Activity Overview</CardTitle>
                        <CardDescription>
                            Monthly breakdown of the commits, PRs and reviews (last 6 months)
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {isPendingActivity ? (
                            <div className="h-80 w-full flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width={"100%"} height={"100%"}>
                                    <BarChart data={monthlyActivity || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey={"name"} />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="commits" name="Commits" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="prs" name="Prs" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="reviews" name="Ai reviews" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage;