import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { recipeServiceClient } from "./recipeServiceClient";
import { useKeycloak } from "@/keycloakProvider";

export function useIngredientSearch(search: string, enabled: boolean = true) {
  const keycloak = useKeycloak();
  const encodedQuery = search === "" ? "" : encodeURI(search);

  return useQuery<Ingredient[]>({
    queryKey: ["ingredients", search],
    queryFn: async (): Promise<Ingredient[]> => {
      return recipeServiceClient(`ingredient?nameQuery=${encodedQuery}`, keycloak.token);
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreateIngredient(onSuccess?: () => void) {
  const keycloak = useKeycloak();
  const queryClient = useQueryClient();

  return useMutation<Ingredient, Error, Ingredient, unknown>({
    mutationFn: async (ingredient): Promise<Ingredient> => {
      return recipeServiceClient("ingredient", keycloak.token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredient)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      onSuccess?.();
    }
  });
}
