import { getContributionStats, getDashboardStats, getMonthlyActivity } from "@/actions/dashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => await getDashboardStats(),
        refetchOnWindowFocus: false,
    })
};

export const useMonthlyActivity = () => {
    return useQuery({
        queryKey: ['monthly-activity'],
        queryFn: async () => await getMonthlyActivity(),
        refetchOnWindowFocus: false,
    })
};

export const useContributionStats = () => {
    return useQuery({
        queryKey: ['contribution-graph'],
        queryFn: async() => await getContributionStats(),
        staleTime: 1000 * 60 * 5,
    })
};