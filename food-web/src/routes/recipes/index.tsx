import {createFileRoute} from '@tanstack/react-router'
import RecipeList from "@/routes/recipes/-components/RecipeList/RecipeList.tsx";

export const Route = createFileRoute('/recipes/')({
    component: Recipes,
})

function Recipes() {
    return (
        <>
          All recipes are here:
            <RecipeList/>
        </>
    )
}
