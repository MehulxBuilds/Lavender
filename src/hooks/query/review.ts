import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/actions/review";

export const useReviews = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: async () => await getReviews(),
    });
};