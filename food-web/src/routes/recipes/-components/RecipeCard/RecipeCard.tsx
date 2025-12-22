import {FC} from "react";
// @ts-ignore
import styles from "./RecipeCard.module.css";
import {Link} from "@tanstack/react-router";

interface Props {
    recipe: Recipe
}

const RecipeCard: FC<Props> = ({recipe}) => {
    return (
        <Link
            className={styles.card}
            to={`/recipes/${recipe.id}`}
        >
            <div className={styles.image} />
            <div className={styles.body}>
                <h3 className={styles.title}>{recipe.name}</h3>
                {recipe.description && (
                    <p className={styles.excerpt}>
                        {recipe.description.length > 100
                            ? recipe.description.substring(0, 100) + '...'
                            : recipe.description}
                    </p>
                )}
                <div className={styles.footer}>
                    <div className={styles.meta}>
                        {recipe.portions && (
                            <span className={styles.metaItem}>
                                {recipe.portions} porsjoner
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default RecipeCard;
