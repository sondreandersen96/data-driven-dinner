import { createFileRoute } from '@tanstack/react-router'
import RecipeList from "@/routes/recipes/-components/RecipeList/RecipeList.tsx";

export const Route = createFileRoute('/')({
  component: Recipes,
})

function Recipes() {
  return (
    <>
      <RecipeList />
    </>
  )
}
