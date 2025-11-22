import { IngredientForm } from "@/components/IngredientForm/IngredientForm.tsx";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";

interface Props {
  ingredient: Ingredient
}

export const IngredientCard = ({ingredient}: Props) => {

  const keycloak = useKeycloak()
  const queryClient = useQueryClient()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const mutation = useMutation<Ingredient, Error, Ingredient, unknown>({
    mutationFn: async (ingredient): Promise<Ingredient> => {
      return recipeServiceClient(`/ingredient/${ingredient.id}`, keycloak.token, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(ingredient)
      })
    },
    onSuccess: () => {
      setEditModalOpen(false)
      queryClient.invalidateQueries()
    },
    onError: () => {
      console.log("Something went wrong")
    }
  })
  return (
    <>
      <IngredientForm isOpen={editModalOpen} ingredient={ingredient} mutation={mutation}
                      closeModal={() => setEditModalOpen(false)}/>
      <div className={"card"}>
        <h2 className={"text-2"}>{ingredient.name}</h2>
        <p className={"text-micro"}>{ingredient.id}</p>
        <button onClick={() => setEditModalOpen(true)}>Edit</button>
      </div>
    </>
  )
}