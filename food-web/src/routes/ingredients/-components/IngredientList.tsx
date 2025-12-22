import {IngredientCard} from "./IngredientCard";
import {useIngredientSearch} from "@/api/ingredientApi";
// @ts-ignore
import styles from "../index.module.css";

interface Props {
    search: string
}

export const IngredientList = ({search}: Props) => {
    const {isPending, error, data} = useIngredientSearch(search)

    if (isPending) return <div className={styles.loading}>Laster ingredienser...</div>
    if (error) return <div className={styles.empty}>En feil oppstod: {error.message}</div>
    if (data.length === 0) return <div className={styles.empty}>Ingen ingredienser funnet</div>

    return (
        <div className={styles.ingredientGrid}>
            {data.map((i) => (
                <IngredientCard key={i.id} ingredient={i}/>
            ))}
        </div>
    )
}
