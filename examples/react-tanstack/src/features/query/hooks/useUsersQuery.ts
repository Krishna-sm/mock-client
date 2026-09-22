import { useQuery } from "@tanstack/react-query";
import { mockApi } from "../../../mock";
import type { User } from "../../../types";

export function useUsersQuery() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => mockApi.users.$get<User[]>(),
  });
}
