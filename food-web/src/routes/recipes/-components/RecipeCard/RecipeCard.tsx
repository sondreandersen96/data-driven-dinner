import {FC} from "react";
// @ts-ignore
import styles from "./RecipeCard.module.css";
import {Link} from "@tanstack/react-router";
// @ts-ignore
import image from "@/assets/generic_food.png"


interface Props {
    recipe: Recipe
}

const RecipeCard: FC<Props> = ({recipe}) => {

    return (
        <Link
            className={'card'}
            to={`/recipes/${recipe.id}`}
        >
            <img className={styles['recipe-card-image']} src={image}/>
            <div>{recipe.name}</div>
        </Link>
    )
}

export default RecipeCard;