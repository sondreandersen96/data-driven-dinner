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

const DEFAULT_SECTION = "Ingredienser";

export function RecipeForm({recipe, mutation, isOpen, closeNewRecipeModal}: Props) {
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(DEFAULT_SECTION);
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);

  const { data: searchResults = [] } = useIngredientSearch(ingredientSearch, showDropdown);
  const ingredientMutation = useCreateIngredient(() => setIngredientModalOpen(false));

  const resetIngredientInput = () => {
    setSelectedIngredient(null);
    setAmount("");
    setUnit("");
  };

  const addIngredientToSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void
  ) => {
    if (amount !== "" && unit && selectedIngredient) {
      const newIngredient: RecipeIngredient = {
        amount: Number(amount),
        unit,
        ingredient: selectedIngredient
      };
      const updatedSections = { ...currentSections };
      if (!updatedSections[currentSection]) {
        updatedSections[currentSection] = [];
      }
      updatedSections[currentSection] = [...updatedSections[currentSection], newIngredient];
      handleChange(updatedSections);
      resetIngredientInput();
    }
  };

  const removeIngredientFromSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void,
    sectionName: string,
    index: number
  ) => {
    const updatedSections = { ...currentSections };
    updatedSections[sectionName] = updatedSections[sectionName].filter((_, i) => i !== index);
    if (updatedSections[sectionName].length === 0) {
      delete updatedSections[sectionName];
    }
    handleChange(updatedSections);
  };

  const addNewSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void
  ) => {
    if (newSectionName.trim() && !currentSections[newSectionName.trim()]) {
      const updatedSections = { ...currentSections, [newSectionName.trim()]: [] };
      handleChange(updatedSections);
      setCurrentSection(newSectionName.trim());
      setNewSectionName("");
      setShowNewSectionInput(false);
    }
  };

  const form = useForm({
    defaultValues: {
      id: recipe?.id ?? null,
      name: recipe?.name ?? "",
      youtube: recipe?.youtube ?? "",
      description: recipe?.description ?? "",
      ingredientsSections: recipe?.ingredientsSections ?? {} as Record<string, RecipeIngredient[]>,
      portions: recipe?.portions ?? null as number | null
    },
    onSubmit: ({value}) => {
      mutation.mutate(
        {
          id: value.id ?? null,
          name: value.name,
          youtube: value.youtube,
          ingredientsSections: value.ingredientsSections,
          description: value.description,
          portions: value.portions
        },
      )
      setIngredientSearch("");
      setShowDropdown(false);
      resetIngredientInput();
      setCurrentSection(DEFAULT_SECTION);
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
            name="ingredientsSections"
            children={(field) => {
              const sections = Object.entries(field.state.value);
              const allIngredientIds = sections.flatMap(([, ingredients]) =>
                ingredients.map(ri => ri.ingredient.id)
              );

              return (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ingredienser</label>

                  {/* Section selector */}
                  <div className={styles.sectionSelector}>
                    <select
                      className={styles.sectionSelect}
                      value={currentSection}
                      onChange={(e) => setCurrentSection(e.target.value)}
                    >
                      {sections.length === 0 && (
                        <option value={DEFAULT_SECTION}>{DEFAULT_SECTION}</option>
                      )}
                      {sections.map(([sectionName]) => (
                        <option key={sectionName} value={sectionName}>{sectionName}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={styles.addSectionBtn}
                      onClick={() => setShowNewSectionInput(true)}
                    >
                      + Ny seksjon
                    </button>
                  </div>

                  {/* New section input */}
                  {showNewSectionInput && (
                    <div className={styles.newSectionRow}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="F.eks. Saus, Tilbehør..."
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.addSectionConfirmBtn}
                        disabled={!newSectionName.trim()}
                        onClick={() => addNewSection(field.state.value, field.handleChange)}
                      >
                        Legg til
                      </button>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => {
                          setShowNewSectionInput(false);
                          setNewSectionName("");
                        }}
                      >
                        Avbryt
                      </button>
                    </div>
                  )}

                  {/* Display existing ingredients by section */}
                  {sections.map(([sectionName, ingredients]) => (
                    ingredients.length > 0 && (
                      <div key={sectionName} className={styles.ingredientSectionBlock}>
                        {sections.length > 1 && (
                          <h4 className={styles.ingredientSectionTitle}>{sectionName}</h4>
                        )}
                        <ul className={styles.ingredientList}>
                          {ingredients.map((recipeIngredient, index) => (
                            <li
                              key={recipeIngredient.ingredient.id ?? index}
                              className={styles.ingredientListItem}
                            >
                              <span>
                                {recipeIngredient.amount} {recipeIngredient.unit} {recipeIngredient.ingredient.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeIngredientFromSection(
                                  field.state.value,
                                  field.handleChange,
                                  sectionName,
                                  index
                                )}
                                className={styles.removeButton}
                              >
                                &times;
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}

                  {/* Add ingredient to current section */}
                  <div className={styles.ingredientSearchContainer}>
                    {!selectedIngredient ? (
                      <>
                        <input
                          type="text"
                          placeholder={`Søk etter ingrediens til "${currentSection}"...`}
                          value={ingredientSearch}
                          onChange={(e) => setIngredientSearch(e.target.value)}
                          onFocus={() => setShowDropdown(true)}
                        />
                        {showDropdown && (
                          <div className={styles.dropdown}>
                            {searchResults
                              .filter((ingredient) => !allIngredientIds.includes(ingredient.id))
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
                            {searchResults.filter((ingredient) => !allIngredientIds.includes(ingredient.id)).length === 0 && (
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
                          <option value="stk">stk</option>
                        </select>
                        <button
                          type="button"
                          disabled={amount === "" || !unit}
                          onClick={() => addIngredientToSection(field.state.value, field.handleChange)}
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
              );
            }}
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
