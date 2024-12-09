/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface UpdateProfileImageInput {
  profileimg: string;  // Profile image can be base64 or URL
}

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation({
    mutationFn: async ({ profileimg }: UpdateProfileImageInput) => {
      try {
        const res = await fetch('/api/users/update', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",  // Ensure the content is sent as JSON
          },
          body: JSON.stringify({ profileimg }), // Send profileimg as a part of the body
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        return data;
      } catch (error: any) {
        throw new Error(error.message || 'Error updating profile image');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidates user data cache
      toast.success('Profile image updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile image');
    },
  });

  return { mutate, isError, error };
};
