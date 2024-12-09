import { useQuery } from "@tanstack/react-query";

const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch auth user");
      }
      const data = await res.json();
      if (data.error) {
        return null; // No user logged in
      }
      return data; // Return user data
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export default useAuthUser;
