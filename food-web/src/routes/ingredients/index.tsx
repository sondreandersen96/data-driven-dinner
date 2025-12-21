import {createFileRoute} from '@tanstack/react-router'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {recipeServiceClient} from "@/api/recipeServiceClient.ts";
import {useKeycloak} from "@/keycloakProvider.tsx";
import {IngredientForm} from "@/components/IngredientForm/IngredientForm.tsx";
import {useState} from "react";
import {IngredientList} from './-components/IngredientList';

export const Route = createFileRoute('/ingredients/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
    const [search, setSearch] = useState("")
    const keycloak = useKeycloak()
    const queryClient = useQueryClient()

    const mutation = useMutation<Ingredient, Error, Ingredient, unknown>({
        mutationFn: async (ingredient): Promise<Ingredient> => {
            return recipeServiceClient('ingredient', keycloak.token, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(ingredient)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries()
            setIngredientModalOpen(false)
        },
        onError: () => {
            console.log("Something went wrong when trying to save Ingredient")
        }
    })


    return (
        <div>
            <IngredientForm
                isOpen={ingredientModalOpen}
                ingredient={null}
                mutation={mutation}
                closeModal={() => setIngredientModalOpen(false)}
            />
            <button onClick={() => setIngredientModalOpen(true)}>New ingredient</button>
            <h1>Ingredients</h1>
            <div>
                Search:
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                    }}>
                </input>

            </div>
            <IngredientList search={search}/>
        </div>
    )
}
