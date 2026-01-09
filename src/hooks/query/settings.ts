import { getUserProfile, updateUserProfile } from "@/actions/settings"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";


export const useGetUserProfile = () => {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => await getUserProfile(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string, email: string }) => await updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] }),
                toast.success("Profile updated successfully")
        },
        onError: () => {
            toast.error("Failed to update profile")
        }
    })
};