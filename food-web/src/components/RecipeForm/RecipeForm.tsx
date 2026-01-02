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

const DEFAULT_SECTION = "Hovedrett";

export function RecipeForm({recipe, mutation, isOpen, closeNewRecipeModal}: Props) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [showNewSectionInput, setShowNewSectionInput] = useState(false);

  const { data: searchResults = [] } = useIngredientSearch(ingredientSearch, showDropdown);
  const ingredientMutation = useCreateIngredient(() => setIngredientModalOpen(false));

  const resetIngredientInput = () => {
    setSelectedIngredient(null);
    setAmount("");
    setUnit("");
    setIngredientSearch("");
    setShowDropdown(false);
  };

  const addIngredientToSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void,
    sectionName: string
  ) => {
    if (amount !== "" && unit && selectedIngredient) {
      const newIngredient: RecipeIngredient = {
        amount: Number(amount),
        unit,
        ingredient: selectedIngredient
      };
      const updatedSections = { ...currentSections };
      if (!updatedSections[sectionName]) {
        updatedSections[sectionName] = [];
      }
      updatedSections[sectionName] = [...updatedSections[sectionName], newIngredient];
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

  const removeSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void,
    sectionName: string
  ) => {
    const updatedSections = { ...currentSections };
    delete updatedSections[sectionName];
    handleChange(updatedSections);
    if (activeSection === sectionName) {
      setActiveSection(null);
    }
  };

  const addNewSection = (
    currentSections: Record<string, RecipeIngredient[]>,
    handleChange: (value: Record<string, RecipeIngredient[]>) => void
  ) => {
    const name = newSectionName.trim() || DEFAULT_SECTION;
    if (!currentSections[name]) {
      const updatedSections = { ...currentSections, [name]: [] };
      handleChange(updatedSections);
      setActiveSection(name);
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
      resetIngredientInput();
      setActiveSection(null);
      setShowNewSectionInput(false);
      setNewSectionName("");
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

              const renderIngredientInput = (sectionName: string) => (
                <div className={styles.addIngredientArea}>
                  {!selectedIngredient ? (
                    <div className={styles.ingredientSearchContainer}>
                      <input
                        type="text"
                        placeholder="Søk etter ingrediens..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        className={styles.searchInput}
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
                    </div>
                  ) : (
                    <div className={styles.selectedIngredientRow}>
                      <span className={styles.selectedName}>{selectedIngredient.name}</span>
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
                        <option value="">Enhet</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="dl">dl</option>
                        <option value="l">l</option>
                        <option value="ts">ts</option>
                        <option value="ss">ss</option>
                        <option value="stk">stk</option>
                      </select>
                      <button
                        type="button"
                        className={styles.addIngredientBtn}
                        disabled={amount === "" || !unit}
                        onClick={() => addIngredientToSection(field.state.value, field.handleChange, sectionName)}
                      >
                        Legg til
                      </button>
                      <button
                        type="button"
                        className={styles.cancelIngredientBtn}
                        onClick={resetIngredientInput}
                      >
                        Avbryt
                      </button>
                    </div>
                  )}
                </div>
              );

              return (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ingredienser</label>

                  <div className={styles.sectionsContainer}>
                    {/* Existing sections as cards */}
                    {sections.map(([sectionName, ingredients]) => (
                      <div
                        key={sectionName}
                        className={`${styles.sectionCard} ${activeSection === sectionName ? styles.sectionCardActive : ''}`}
                      >
                        <div className={styles.sectionCardHeader}>
                          <h4 className={styles.sectionCardTitle}>{sectionName}</h4>
                          <button
                            type="button"
                            className={styles.removeSectionBtn}
                            onClick={() => removeSection(field.state.value, field.handleChange, sectionName)}
                            title="Fjern seksjon"
                          >
                            &times;
                          </button>
                        </div>

                        {ingredients.length > 0 && (
                          <ul className={styles.ingredientList}>
                            {ingredients.map((recipeIngredient, index) => (
                              <li
                                key={recipeIngredient.ingredient.id ?? index}
                                className={styles.ingredientListItem}
                              >
                                <span className={styles.ingredientText}>
                                  <span className={styles.ingredientAmount}>
                                    {recipeIngredient.amount} {recipeIngredient.unit}
                                  </span>
                                  {recipeIngredient.ingredient.name}
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
                        )}

                        {activeSection === sectionName ? (
                          renderIngredientInput(sectionName)
                        ) : (
                          <button
                            type="button"
                            className={styles.activateSectionBtn}
                            onClick={() => {
                              setActiveSection(sectionName);
                              resetIngredientInput();
                            }}
                          >
                            + Legg til ingrediens
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add new section */}
                    {showNewSectionInput ? (
                      <div className={styles.newSectionCard}>
                        <input
                          type="text"
                          className={styles.newSectionInput}
                          placeholder="Navn på seksjon (f.eks. Saus, Tilbehør)"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          autoFocus
                        />
                        <p className={styles.newSectionHint}>
                          La feltet stå tomt for å bruke "{DEFAULT_SECTION}"
                        </p>
                        <div className={styles.newSectionActions}>
                          <button
                            type="button"
                            className={styles.addSectionConfirmBtn}
                            onClick={() => addNewSection(field.state.value, field.handleChange)}
                          >
                            Opprett seksjon
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
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.addSectionBtn}
                        onClick={() => setShowNewSectionInput(true)}
                      >
                        + {sections.length === 0 ? "Legg til ingredienser" : "Legg til ny seksjon"}
                      </button>
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
