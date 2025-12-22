import { useForm } from "@tanstack/react-form"
import { UseMutationResult } from "@tanstack/react-query";
// @ts-ignore
import styles from "./IngredientForm.module.css";

type Props = {
  isOpen: boolean
  ingredient: Ingredient | null
  mutation: UseMutationResult<Ingredient, Error, Ingredient, unknown>
  closeModal: () => void
}

export const IngredientForm = ({isOpen, ingredient, mutation, closeModal}: Props) => {

  const form = useForm({
    defaultValues: {
      id: ingredient?.id ?? null,
      name: ingredient?.name ?? ""
    },
    onSubmit: ({value}) => {
      mutation.mutate({
        id: value.id ?? null,
        name: value.name
      })
      closeModal()
    }
  })

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {ingredient ? "Rediger ingrediens" : "Legg til ny ingrediens"}
          </h2>
          <button
            className={styles.modalClose}
            onClick={closeModal}
            type="button"
          >
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <form.Field
            name="name"
            children={(field) => (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Navn</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="F.eks. Hvitløk, Olivenolje, Parmesan..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={closeModal}
          >
            Avbryt
          </button>
          <button
            type="button"
            className={styles.btnSubmit}
            onClick={form.handleSubmit}
          >
            {ingredient ? "Lagre endringer" : "Legg til"}
          </button>
        </div>
      </div>
    </div>
  )
}
