import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../../../mock";
import type { User, CreateUserInput } from "../../../types";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput): Promise<User> => {
      return mockApi.users.$post<User>({
        json: input,
      });
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) => [newUser, ...old]);
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await mockApi.users.$delete({
        params: { id },
      });
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.filter((u) => u.id !== deletedId)
      );
    },
  });
}
