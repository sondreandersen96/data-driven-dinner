import {useNavigate} from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {RecipeForm} from "@/components/RecipeForm/RecipeForm.tsx";
import { recipeServiceUrl } from "@/globals.ts";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";

type Props = {
    isOpen: boolean
    closeNewRecipeModal: () => void
}

function NewRecipe({isOpen, closeNewRecipeModal}: Props) {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const mutation = useMutation<Recipe, Error, Recipe, unknown>({
        mutationFn: async (recipe): Promise<Recipe> => {
            return recipeServiceClient('recipe', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(recipe)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['recipes']})
            navigate({to: '/recipes'})
        },
        onError: () => {
            console.log("Something went wrong...")
        }
    })

    return (
        <RecipeForm recipe={null} mutation={mutation} isOpen={isOpen} closeNewRecipeModal={closeNewRecipeModal}/>
    )
}

export default NewRecipe;