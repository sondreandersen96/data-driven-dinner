import Ingredient from "../../../domain/Ingredient";
import {IngredientCard} from "./IngredientCard";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {recipeServiceClient} from "@/api/recipeServiceClient.ts";
import {useKeycloak} from "@/keycloakProvider.tsx";

interface Props {
    search: string
}

export const IngredientList = ({search}: Props) => {
    const keycloak = useKeycloak()
    const encodedQuery = search === "" ? "" : encodeURI(search)
    const {isPending, error, data} = useQuery<Ingredient[]>({
        keepPreviousData: true,
        queryKey: ['ingredients', search],
        queryFn: async (): Promise<Ingredient[]> => {
            return recipeServiceClient(`ingredient?nameQuery=${encodedQuery}`, keycloak.token)
        },
    })

    if (isPending) return 'Loading'
    if (error) return 'An error has occured: ' + error.message
    if (data.length === 0) return <div>Sorry... could not find anything... 🤷</div>
    return (
        <div className={"cards-container"}>
            {data.map((i) => (
                    <IngredientCard key={i.id} ingredient={i}/>
                )
            )}
        </div>
    )
}