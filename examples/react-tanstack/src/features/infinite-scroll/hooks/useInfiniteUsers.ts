import { useInfiniteQuery } from "@tanstack/react-query";
import { mockApi } from "../../../mock";
import type { User } from "../../../types";

export function useInfiniteUsers() {
  return useInfiniteQuery<User[], Error>({
    queryKey: ["infinite-users"],
    queryFn: async () => {
      // 1-second simulated network delay to demonstrate loading spinner
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fetches 10 items per page from mock runtime
      return mockApi.users.$get<User[]>({
        mock: { count: 10 },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      // Supports loading up to 100 pages (1,000+ records)
      const maxPages = 100;
      return allPages.length < maxPages ? allPages.length + 1 : undefined;
    },
  });
}
