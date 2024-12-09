/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface UpdateCoverImageInput {
  coverimg: string;  // String, which can be a base64 or URL
}

export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation({
    mutationFn: async ({ coverimg }: UpdateCoverImageInput) => {
      try {
        const res = await fetch('/api/users/update', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coverimg }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        return data;
      } catch (error: any) {
        // Capture detailed error if possible
        throw new Error(error?.message || 'Error updating cover image');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Invalidates user data cache
      toast.success('Cover image updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cover image');
    },
  });

  return { mutate, isError, error };
};
