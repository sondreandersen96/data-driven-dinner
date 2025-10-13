import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import RecipeCard from "@/routes/recipes/-components/RecipeCard/RecipeCard.tsx";
// @ts-ignore
import styles from "./RecipeList.module.css"
import { recipeServiceUrl } from "@/globals.ts";

const RecipeList: FC = () => {
    const {isPending, error, data } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: async (): Promise<Recipe[]> => {
            return fetch(`${recipeServiceUrl}/recipe`).then((res) => res.json())
        },
    })

    if (isPending) return 'Loading'
    if (error) return 'An error has occured: ' + error.message
    return (
        <div className={styles['recipe-list']}>
            {data.map((r) => (
                <div key={r.id}>
                    <RecipeCard recipe={r}/>
                </div>
            ))}
        </div>
    )
}

export default RecipeList;