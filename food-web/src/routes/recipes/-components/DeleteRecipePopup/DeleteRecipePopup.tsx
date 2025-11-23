import { useMutation } from "@tanstack/react-query";
import { recipeServiceClientNoContent } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  isOpen: boolean
  recipeId: string
  close: () => void
}

export const DeleteRecipePopup = ({recipeId, isOpen, close}: Props) => {
  if (!isOpen) return null
  const keycloak = useKeycloak()
  const navigate = useNavigate()

  const deleteRecipe = useMutation({
    mutationFn: async () => {
      return recipeServiceClientNoContent(`/recipe/${recipeId}`, keycloak.token, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      })
    },
    onSuccess: () => {
      close()
      navigate({to: "/recipes"})
    },
    onError: () => {
      console.log("Something went wrong")
    }
  });

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-content"}>
        Are you sure you want to delete this recipe?
        <button onClick={() => deleteRecipe.mutate()}>Ja, denne var ikke så god</button>
        <button onClick={close}>Avbryt</button>
      </div>
    </div>
  )
}