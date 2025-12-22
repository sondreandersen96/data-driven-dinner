import { IngredientForm } from "@/components/IngredientForm/IngredientForm.tsx";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
// @ts-ignore
import styles from "../index.module.css";

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
      <IngredientForm
        isOpen={editModalOpen}
        ingredient={ingredient}
        mutation={mutation}
        closeModal={() => setEditModalOpen(false)}
      />
      <div className={styles.ingredientCard}>
        <span className={styles.ingredientName}>{ingredient.name}</span>
        <button
          className={styles.editButton}
          onClick={() => setEditModalOpen(true)}
        >
          Rediger
        </button>
      </div>
    </>
  )
}
