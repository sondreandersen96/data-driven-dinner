import {createFileRoute} from '@tanstack/react-router'
import {IngredientForm} from "@/components/IngredientForm/IngredientForm.tsx";
import {useState} from "react";
import {IngredientList} from './-components/IngredientList';
import {useCreateIngredient} from "@/api/ingredientApi";
// @ts-ignore
import styles from "./index.module.css";

export const Route = createFileRoute('/ingredients/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
    const [search, setSearch] = useState("")

    const mutation = useCreateIngredient(() => setIngredientModalOpen(false))

    return (
        <div className={styles.container}>
            <IngredientForm
                isOpen={ingredientModalOpen}
                ingredient={null}
                mutation={mutation}
                closeModal={() => setIngredientModalOpen(false)}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Ingredienser</h1>
                <p className={styles.subtitle}>
                    Administrer ingrediensene som brukes i oppskriftene dine
                </p>
            </div>

            <div className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <input
                        className={styles.searchInput}
                        placeholder="Søk etter ingredienser..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    className={styles.addButton}
                    onClick={() => setIngredientModalOpen(true)}
                >
                    + Ny ingrediens
                </button>
            </div>

            <IngredientList search={search}/>
        </div>
    )
}
