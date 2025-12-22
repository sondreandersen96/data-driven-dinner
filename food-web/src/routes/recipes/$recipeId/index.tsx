import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import renderYoutube from "@/components/EmbeddedYoutube/EmbeddedYoutube.tsx";
import {useState} from "react";
import {RecipeForm} from "@/components/RecipeForm/RecipeForm.tsx";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import { DeleteRecipePopup } from "@/routes/recipes/-components/DeleteRecipePopup/DeleteRecipePopup.tsx";
// @ts-ignore
import styles from "./index.module.css";

export const Route = createFileRoute('/recipes/$recipeId/')({
    component: RecipeIdPage,
})

function RecipeIdPage() {
    const [portions, setPortions] = useState<number | null>(null)
    const {recipeId} = Route.useParams()

    return (
        <div className={styles.container}>
            <RecipeContent
                recipeId={recipeId}
                portions={portions}
                setPortions={setPortions}
            />
        </div>
    )
}

interface RecipeContentProps {
    recipeId: string;
    portions: number | null;
    setPortions: (value: number | null) => void;
}

function RecipeContent({ recipeId, portions, setPortions }: RecipeContentProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const queryClient = useQueryClient()
    const keycloak = useKeycloak()

    const {isPending, error, data, isFetching} = useQuery<Recipe>({
        queryKey: ['recipe', recipeId, portions],
        queryFn: async (): Promise<Recipe> => {
            const url = portions ? `recipe/${recipeId}?portions=${portions}` : `recipe/${recipeId}`
            return recipeServiceClient(url, keycloak.token)
        }
    })

    const mutation = useMutation<Recipe, Error, Recipe, unknown>({
        mutationFn: async (recipe): Promise<Recipe> => {
            return recipeServiceClient(`recipe/${recipeId}`, keycloak.token, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(recipe)
            })
        },
        onSuccess: () => {
            setEditOpen(false)
            queryClient.invalidateQueries({queryKey: ['recipe']})
        },
        onError: () => {
            console.log("Something went wrong...")
        }
    })

    if (isPending || isFetching) {
        return <div className={styles.loading}>Laster oppskrift...</div>
    }

    if (error) {
        return <div className={styles.loading}>Ops! Noe gikk galt...</div>
    }

    const currentPortions = portions ?? data.portions ?? 4;

    return (
        <>
            <DeleteRecipePopup isOpen={deleteOpen} recipeId={data.id!} close={() => setDeleteOpen(false)} />

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>{data.name}</h1>
                <div className={styles.meta}>
                    {data.portions && (
                        <span className={styles.metaItem}>
                            {data.portions} porsjoner
                        </span>
                    )}
                    {data.ingredients.length > 0 && (
                        <span className={styles.metaItem}>
                            {data.ingredients.length} ingredienser
                        </span>
                    )}
                </div>
            </div>

            {/* Video */}
            {data.youtube && data.youtube.trim() !== "" && (
                <div className={styles.videoSection}>
                    {renderYoutube(data.youtube)}
                </div>
            )}

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Ingredients */}
                {data.ingredients.length > 0 && (
                    <div className={styles.ingredientsCard}>
                        <h2 className={styles.sectionTitle}>Ingredienser</h2>

                        {data.portions && (
                            <div className={styles.portionsSelector}>
                                <span className={styles.portionsLabel}>Porsjoner</span>
                                <div className={styles.portionsControls}>
                                    <button
                                        className={styles.portionsBtn}
                                        onClick={() => setPortions(Math.max(1, currentPortions - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className={styles.portionsValue}
                                        value={currentPortions}
                                        min="1"
                                        onChange={(e) => setPortions(
                                            e.target.value === "" ? null : Math.max(1, Number(e.target.value))
                                        )}
                                    />
                                    <button
                                        className={styles.portionsBtn}
                                        onClick={() => setPortions(currentPortions + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <ul className={styles.ingredientList}>
                            {data.ingredients.map((ri, index) => (
                                <li key={ri.ingredient.id ?? index} className={styles.ingredientItem}>
                                    <span className={styles.ingredientAmount}>
                                        {ri.amount} {ri.unit}
                                    </span>
                                    <span className={styles.ingredientName}>
                                        {ri.ingredient.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Description */}
                <div className={styles.descriptionSection}>
                    <h2 className={styles.sectionTitle}>Fremgangsmåte</h2>
                    <p className={styles.description}>{data.description}</p>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => setEditOpen(true)}>
                    Rediger
                </button>
                <button className={styles.btnDelete} onClick={() => setDeleteOpen(true)}>
                    Slett
                </button>
            </div>

            <RecipeForm
                recipe={data}
                mutation={mutation}
                isOpen={editOpen}
                closeNewRecipeModal={() => setEditOpen(false)}
            />
        </>
    )
}
