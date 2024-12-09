import { useQuery } from "@tanstack/react-query";

const useSuggestion = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        if (!res.ok) {
          throw new Error("Failed to fetch suggested users");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    },
  });
};

export default useSuggestion;
