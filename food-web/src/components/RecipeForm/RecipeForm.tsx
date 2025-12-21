import { useState } from "react";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
// @ts-ignore
import styles from "./RecipeForm.module.css";

type Props = {
  recipe: Recipe | null
  mutation: UseMutationResult<Recipe, Error, Recipe, unknown>
  isOpen: boolean;
  closeNewRecipeModal: () => void
}

export function RecipeForm({recipe, mutation, isOpen, closeNewRecipeModal}: Props) {
  const keycloak = useKeycloak();
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [unit, setUnit] = useState("");

  const { data: searchResults = [] } = useQuery<Ingredient[]>({
    queryKey: ['ingredients', ingredientSearch],
    queryFn: async (): Promise<Ingredient[]> => {
      const encodedQuery = ingredientSearch === "" ? "" : encodeURI(ingredientSearch);
      return recipeServiceClient(`ingredient?nameQuery=${encodedQuery}`, keycloak.token);
    },
    enabled: showDropdown,
  });

  const form = useForm({
    defaultValues: {
      id: recipe?.id ?? null,
      name: recipe?.name ?? "",
      youtube: recipe?.youtube ?? "",
      description: recipe?.description ?? "",
      ingredients: recipe?.ingredients ?? [] as RecipeIngredient[]
    },
    onSubmit: ({value}) => {
      console.log(value.name, value.youtube)
      mutation.mutate(
        {
          id: value.id ?? null,
          name: value.name,
          youtube: value.youtube,
          ingredients: value.ingredients,
          description: value.description
        },
      )
      setIngredientSearch("");
      setShowDropdown(false);
      setSelectedIngredient(null);
      setAmount("");
      setUnit("");
      closeNewRecipeModal()
      recipe = null
    }
  })

  if (!isOpen) return null

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-content"}>
        <h2>{recipe ? "Edit Recipe" : "Add New Recipe"}</h2>
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label>Tittel</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="youtube"
          children={(field) => (
            <div>
              <label>YouTube Link</label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="ingredients"
          children={(field) => (
            <div>
              <label>Ingredienser</label>

              {field.state.value.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, margin: "8px 0" }}>
                  {field.state.value.map((recipeIngredient, index) => (
                    <li
                      key={recipeIngredient.ingredient.id ?? index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 0",
                        borderBottom: "1px solid #eee"
                      }}
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
                        style={{ background: "none", border: "none", cursor: "pointer", color: "red" }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add new ingredient section */}
              <div style={{ position: "relative", marginTop: "8px" }}>
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
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          maxHeight: "200px",
                          overflowY: "auto",
                          background: "white",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          zIndex: 10
                        }}
                      >
                        {searchResults
                          .filter((ingredient) => !field.state.value.some((ri) => ri.ingredient.id === ingredient.id))
                          .map((ingredient) => (
                            <div
                              key={ingredient.id}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee"
                              }}
                              onClick={() => {
                                setSelectedIngredient(ingredient);
                                setIngredientSearch("");
                                setShowDropdown(false);
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                            >
                              {ingredient.name}
                            </div>
                          ))}
                        {searchResults.filter((ingredient) => !field.state.value.some((ri) => ri.ingredient.id === ingredient.id)).length === 0 && (
                          <div style={{ padding: "8px", color: "#888" }}>Ingen ingredienser funnet</div>
                        )}
                      </div>
                    )}
                    {showDropdown && (
                      <button
                        type="button"
                        onClick={() => setShowDropdown(false)}
                        style={{ marginTop: "4px" }}
                      >
                        Lukk
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span><strong>{selectedIngredient.name}</strong></span>
                    <input
                      type="number"
                      placeholder="Mengde"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      style={{ width: "80px" }}
                    />
                    <input
                      type="text"
                      placeholder="Enhet (g, dl, stk...)"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      style={{ width: "120px" }}
                    />
                    <button
                      type="button"
                      disabled={amount === "" || !unit}
                      onClick={() => {
                        if (amount !== "" && unit && selectedIngredient) {
                          const newIngredient: RecipeIngredient = {
                            amount: Number(amount),
                            unit,
                            ingredient: selectedIngredient
                          };
                          field.handleChange([...field.state.value, newIngredient]);
                          setSelectedIngredient(null);
                          setAmount("");
                          setUnit("");
                        }
                      }}
                    >
                      Legg til
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIngredient(null);
                        setAmount("");
                        setUnit("");
                      }}
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
            <div>
              <label>Beskrivelse</label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={20}
                cols={40}
              />
            </div>
          )}
        />
        <button onClick={() => closeNewRecipeModal()}>Lukk</button>
        <button onClick={form.handleSubmit}>Lagre</button>
      </div>
    </div>
  )
}

