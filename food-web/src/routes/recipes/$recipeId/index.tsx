import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import renderYoutube from "@/components/EmbeddedYoutube/EmbeddedYoutube.tsx";
import {useState} from "react";
import {RecipeForm} from "@/components/RecipeForm/RecipeForm.tsx";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import { DeleteRecipePopup } from "@/routes/recipes/-components/DeleteRecipePopup/DeleteRecipePopup.tsx";

export const Route = createFileRoute('/recipes/$recipeId/')({
    component: RecipeId,
})

function RecipeId() {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const queryClient = useQueryClient()

    const keycloak = useKeycloak()

    const {recipeId} = Route.useParams()
    const {isPending, error, data, isFetching} = useQuery<Recipe>({
        queryKey: ['recipe', recipeId],
        queryFn: async (): Promise<Recipe> => {
            return recipeServiceClient(`recipe/${recipeId}`, keycloak.token)
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
            // navigate({to: `/recipes/${recipeId}`})
        },
        onError: () => {
            console.log("Something went wrong...")
        }
    })

    const handleEdit = () => {
        console.log("editing")
        setEditOpen(true)
    }

    const handleDelete = () => {
        setDeleteOpen(true)
    }

    if (isPending || isFetching) return <div>Loading...</div>
    if (error) return <div>Ups! Something has gone wrong here...</div>
    return (
        <div>
            <DeleteRecipePopup isOpen={deleteOpen} recipeId={data.id!} close={() => setDeleteOpen(false)} />
            <h1>{data.name}</h1>
            {data.youtube != null && data.youtube != undefined && data.youtube != "" && renderYoutube(data.youtube)}

            {data.ingredients.length > 0 && (
                <>
                    <h3>Ingredienser</h3>
                    <ul>
                        {data.ingredients.map((ri, index) => (
                            <li key={ri.ingredient.id ?? index}>
                                {ri.amount} {ri.unit} {ri.ingredient.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <h3>Beskrivelse</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.description}</p>
            <br/>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <RecipeForm recipe={data} mutation={mutation} isOpen={editOpen} closeNewRecipeModal={() => setEditOpen(false)}/>
        </div>
    )
}
