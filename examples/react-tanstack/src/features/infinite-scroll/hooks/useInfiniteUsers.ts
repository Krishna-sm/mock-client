import { useInfiniteQuery } from "@tanstack/react-query";
import { mockApi } from "../../../mock";
import type { User } from "../../../types";

export function useInfiniteUsers() {
  return useInfiniteQuery<User[], Error>({
    queryKey: ["infinite-users"],
    queryFn: async () => {
      // Fetches mock items
      return mockApi.users.$get<User[]>({
        mock: { count: 3 },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      // Max 4 pages demonstration
      return allPages.length < 4 ? allPages.length + 1 : undefined;
    },
  });
}
