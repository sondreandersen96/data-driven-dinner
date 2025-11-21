import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import { IngredientForm } from "@/components/IngredientForm/IngredientForm.tsx";
import { useState } from "react";

export const Route = createFileRoute('/ingredients/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
  const keycloak = useKeycloak()
  const queryClient = useQueryClient()
  const {isPending, error, data} = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async (): Promise<Ingredient[]> => {
      return recipeServiceClient(`ingredient`, keycloak.token)
    },
  })

  const mutation = useMutation<Ingredient, Error, Ingredient, unknown>({
    mutationFn: async (ingredient): Promise<Ingredient> => {
      return recipeServiceClient('ingredient', keycloak.token, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(ingredient)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      setIngredientModalOpen(false)
    },
    onError: () => {
      console.log("Something went wrong when trying to save Ingredient")
    }
  })

  if (isPending) return 'Loading'
  if (error) return 'An error has occured: ' + error.message
  return (
    <div>
      <IngredientForm
        isOpen={ingredientModalOpen}
        ingredient={null}
        mutation={mutation}
        closeModal={() => setIngredientModalOpen(false)}
      />
      <button onClick={() => setIngredientModalOpen(true)}>New ingredient</button>
      <h1>Ingredients</h1>
      {data.map((i) => (
          <div>
            {i.name}
          </div>
        )
      )}
    </div>
  )
}
