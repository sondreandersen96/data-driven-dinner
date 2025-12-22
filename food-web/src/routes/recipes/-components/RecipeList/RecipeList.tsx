import {FC} from "react";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import RecipeCard from "@/routes/recipes/-components/RecipeCard/RecipeCard.tsx";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";
import styles from './RecipeList.module.css';

interface Props {
    searchQuery?: string;
    isAiSearch?: boolean;
}

const RecipeList: FC<Props> = ({ searchQuery = '', isAiSearch = false }) => {

    const keycloak = useKeycloak()
    const encodedQuery = searchQuery.trim() ? encodeURI(searchQuery) : '';

    const {isPending, error, data, isFetching } = useQuery<Recipe[]>({
        queryKey: ['recipes', searchQuery, isAiSearch],
        queryFn: async (): Promise<Recipe[]> => {
            let url = 'recipe';
            if (encodedQuery) {
                url = isAiSearch
                    ? `recipe/ai-search?query=${encodedQuery}`
                    : `recipe?query=${encodedQuery}`;
            }
            return recipeServiceClient(url, keycloak.token)
        },
        placeholderData: keepPreviousData,
    })

    if (isPending) return <div>Loading...</div>
    if (error) return <div>An error has occurred: {error.message}</div>

    return (
        <div className="recipe-grid">
            {data.length > 0 ? (
                data.map((r) => (
                    <RecipeCard key={r.id} recipe={r}/>
                ))
            ) : (
                (data.length === 0) ? <div className={styles.empty}>Ingen ingredienser funnet</div> : <></>
            )}
        </div>
    )
}

export default RecipeList;