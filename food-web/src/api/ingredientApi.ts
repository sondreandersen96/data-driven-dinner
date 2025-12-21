import { useQuery } from "@tanstack/react-query";
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
  });
}
