import {createFileRoute} from '@tanstack/react-router'
import {IngredientForm} from "@/components/IngredientForm/IngredientForm.tsx";
import {useState} from "react";
import {IngredientList} from './-components/IngredientList';
import {useCreateIngredient} from "@/api/ingredientApi";

export const Route = createFileRoute('/ingredients/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
    const [search, setSearch] = useState("")

    const mutation = useCreateIngredient(() => setIngredientModalOpen(false))


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
