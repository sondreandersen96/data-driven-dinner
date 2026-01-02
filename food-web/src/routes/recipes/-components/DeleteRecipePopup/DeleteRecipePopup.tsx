import { useMutation } from "@tanstack/react-query";
import { recipeServiceClientNoContent } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import { useNavigate } from "@tanstack/react-router";
// @ts-ignore
import styles from "./DeleteRecipePopup.module.css";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Slett oppskrift</h2>
          <button
            className={styles.modalClose}
            onClick={close}
            type="button"
          >
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.warningText}>
            Er du sikker på at du vil slette denne oppskriften? Denne handlingen kan ikke angres.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={close}>
            Avbryt
          </button>
          <button className={styles.btnDelete} onClick={() => deleteRecipe.mutate()}>
            Ja, slett oppskriften
          </button>
        </div>
      </div>
    </div>
  )
}