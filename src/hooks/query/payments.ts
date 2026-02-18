import { getSubscriptionData } from "@/actions/payments";
import { useQuery } from "@tanstack/react-query";

export const usePayments = () => {
    return useQuery({
        queryKey: ["subscription-data"],
        queryFn: async () => await getSubscriptionData(),
        refetchOnWindowFocus: true,
    });
};