import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import renderYoutube from "@/components/EmbeddedYoutube/EmbeddedYoutube.tsx";
import {useState} from "react";
import {RecipeForm} from "@/components/RecipeForm/RecipeForm.tsx";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";

export const Route = createFileRoute('/recipes/$recipeId/')({
    component: RecipeId,
})

function RecipeId() {
    const [editOpen, setEditOpen] = useState(false)

    const queryClient = useQueryClient()

    const {recipeId} = Route.useParams()
    const {isPending, error, data, isFetching} = useQuery<Recipe>({
        queryKey: ['recipe', recipeId],
        queryFn: async (): Promise<Recipe> => {
            return recipeServiceClient('recipe/${recipeId}')
        }
    })

    const mutation = useMutation<Recipe, Error, Recipe, unknown>({
        mutationFn: async (recipe): Promise<Recipe> => {
            return recipeServiceClient(`recipe/${recipeId}`, {
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

    if (isPending || isFetching) return <div>Loading...</div>
    if (error) return <div>Ups! Something has gone wrong here...</div>
    return (
        <div>
            <h1>{data.name}</h1>
            {data.youtube != null && data.youtube != undefined && data.youtube != "" && renderYoutube(data.youtube)}
            <h3>Beskrivelse</h3>

            <p style={{ whiteSpace: 'pre-wrap' }}>{data.description}</p>
            <br/>
            <button onClick={handleEdit}>Edit</button>
            <RecipeForm recipe={data} mutation={mutation} isOpen={editOpen} closeNewRecipeModal={() => setEditOpen(false)}/>
        </div>
    )
}
