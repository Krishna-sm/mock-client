import { useQuery } from "@tanstack/react-query";
import { mockApi } from "../../../mock";
import type { Product } from "../../../types";

export function useProductsQuery() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => mockApi.products.$get<Product[]>(),
  });
}
