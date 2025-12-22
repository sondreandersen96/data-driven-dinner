import { useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useIngredientSearch, useCreateIngredient } from "@/api/ingredientApi";
import { IngredientForm } from "@/components/IngredientForm/IngredientForm";
// @ts-ignore
import styles from "./RecipeForm.module.css";

type Props = {
  recipe: Recipe | null
  mutation: UseMutationResult<Recipe, Error, Recipe, unknown>
  isOpen: boolean;
  closeNewRecipeModal: () => void
}

export function RecipeForm({recipe, mutation, isOpen, closeNewRecipeModal}: Props) {
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);

  const { data: searchResults = [] } = useIngredientSearch(ingredientSearch, showDropdown);
  const ingredientMutation = useCreateIngredient(() => setIngredientModalOpen(false));

  const resetIngredientInput = () => {
    setSelectedIngredient(null);
    setAmount("");
    setUnit("");
  };

  const addIngredient = (
    currentIngredients: RecipeIngredient[],
    handleChange: (value: RecipeIngredient[]) => void
  ) => {
    if (amount !== "" && unit && selectedIngredient) {
      const newIngredient: RecipeIngredient = {
        amount: Number(amount),
        unit,
        ingredient: selectedIngredient
      };
      handleChange([...currentIngredients, newIngredient]);
      resetIngredientInput();
    }
  };

  const form = useForm({
    defaultValues: {
      id: recipe?.id ?? null,
      name: recipe?.name ?? "",
      youtube: recipe?.youtube ?? "",
      description: recipe?.description ?? "",
      ingredients: recipe?.ingredients ?? [] as RecipeIngredient[],
      portions: recipe?.portions ?? null as number | null
    },
    onSubmit: ({value}) => {
      mutation.mutate(
        {
          id: value.id ?? null,
          name: value.name,
          youtube: value.youtube,
          ingredients: value.ingredients,
          description: value.description,
          portions: value.portions
        },
      )
      setIngredientSearch("");
      setShowDropdown(false);
      resetIngredientInput();
      closeNewRecipeModal()
    }
  })

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <IngredientForm
        isOpen={ingredientModalOpen}
        ingredient={null}
        mutation={ingredientMutation}
        closeModal={() => setIngredientModalOpen(false)}
      />
      <div className="modal-content">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {recipe ? "Rediger oppskrift" : "Legg til ny oppskrift"}
          </h2>
          <button
            className={styles.modalClose}
            onClick={() => closeNewRecipeModal()}
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
                <label className={styles.formLabel}>Tittel</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="F.eks. Kremet carbonara med basilikum"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="youtube"
            children={(field) => (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>YouTube Link</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="https://youtube.com/watch?v=..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />

          <form.Field
            name="portions"
            children={(field) => (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Antall porsjoner</label>
                <input
                  type="number"
                  className={styles.formInput}
                  min="1"
                  placeholder="4"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
            )}
          />

          <form.Field
            name="ingredients"
            children={(field) => (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ingredienser</label>

                {field.state.value.length > 0 && (
                  <ul className={styles.ingredientList}>
                    {field.state.value.map((recipeIngredient, index) => (
                      <li
                        key={recipeIngredient.ingredient.id ?? index}
                        className={styles.ingredientListItem}
                      >
                        <span>
                          {recipeIngredient.amount} {recipeIngredient.unit} {recipeIngredient.ingredient.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            field.handleChange(
                              field.state.value.filter((_, i) => i !== index)
                            );
                          }}
                          className={styles.removeButton}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className={styles.ingredientSearchContainer}>
                  {!selectedIngredient ? (
                    <>
                      <input
                        type="text"
                        placeholder="Søk etter ingrediens..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                      />
                      {showDropdown && (
                        <div className={styles.dropdown}>
                          {searchResults
                            .filter((ingredient) => !field.state.value.some((ri) => ri.ingredient.id === ingredient.id))
                            .map((ingredient) => (
                              <div
                                key={ingredient.id}
                                className={styles.dropdownItem}
                                onClick={() => {
                                  setSelectedIngredient(ingredient);
                                  setIngredientSearch("");
                                  setShowDropdown(false);
                                }}
                              >
                                {ingredient.name}
                              </div>
                            ))}
                          {searchResults.filter((ingredient) => !field.state.value.some((ri) => ri.ingredient.id === ingredient.id)).length === 0 && (
                            <div className={styles.noResults}>
                              <span>Ingen ingredienser funnet</span>
                              <button
                                type="button"
                                onClick={() => setIngredientModalOpen(true)}
                                className={styles.createNewButton}
                              >
                                Opprett ny
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {showDropdown && (
                        <button
                          type="button"
                          onClick={() => setShowDropdown(false)}
                          className={styles.closeDropdownButton}
                        >
                          Lukk
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={styles.selectedIngredientRow}>
                      <span><strong>{selectedIngredient.name}</strong></span>
                      <input
                        type="number"
                        placeholder="Mengde"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        className={styles.amountInput}
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className={styles.unitInput}
                      >
                        <option value="">Velg enhet</option>
                        <option value="g">gram</option>
                        <option value="dl">dl</option>
                        <option value="l">l</option>
                        <option value="ts">ts</option>
                        <option value="ss">ss</option>
                      </select>
                      <button
                        type="button"
                        disabled={amount === "" || !unit}
                        onClick={() => addIngredient(field.state.value, field.handleChange)}
                      >
                        Legg til
                      </button>
                      <button
                        type="button"
                        onClick={resetIngredientInput}
                      >
                        Avbryt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Beskrivelse / Fremgangsmåte</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Beskriv trinn-for-trinn hvordan retten lages..."
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
            onClick={() => closeNewRecipeModal()}
          >
            Avbryt
          </button>
          <button
            type="button"
            className={styles.btnSubmit}
            onClick={form.handleSubmit}
          >
            {recipe ? "Lagre endringer" : "Publiser oppskrift"}
          </button>
        </div>
      </div>
    </div>
  )
}
