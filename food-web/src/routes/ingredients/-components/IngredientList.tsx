import {IngredientCard} from "./IngredientCard";
import {useIngredientSearch} from "@/api/ingredientApi";

interface Props {
    search: string
}

export const IngredientList = ({search}: Props) => {
    const {isPending, error, data} = useIngredientSearch(search)

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