import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import RecipeCard from "@/routes/recipes/-components/RecipeCard/RecipeCard.tsx";
// @ts-ignore
import styles from "./RecipeList.module.css"
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";

const RecipeList: FC = () => {

    const keycloak = useKeycloak()

    const {isPending, error, data } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: async (): Promise<Recipe[]> => {
            return recipeServiceClient(`recipe`, keycloak.token)
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