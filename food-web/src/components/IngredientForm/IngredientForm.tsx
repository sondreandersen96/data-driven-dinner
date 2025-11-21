import { useForm } from "@tanstack/react-form"
import { UseMutationResult } from "@tanstack/react-query";

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
    <div className={"modal-overlay"}>
      <div className={"modal-content"}>
        <h2>{ingredient ? "Edit Ingredient" : "Add New Ingredient"}</h2>
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label>Name</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <button onClick={closeModal}>Lukk</button>
        <button onClick={form.handleSubmit}>Lagre</button>
      </div>
    </div>
  )
}