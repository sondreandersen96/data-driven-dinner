package no.sondre.repository

import no.sondre.domain.RecipeIngredient

fun List<RecipeIngredient>.serialize(): List<Map<String, Any>> {
    return this.map { re ->
        mapOf(
            "amount" to re.amount,
            "unit" to re.unit,
            "ingredient" to re.ingredient.idSafe()
        )
    }
}

fun  Map<String, List<Map<String, String>>>.deserializeRecipeIngredients(): List<RecipeIngredient> {
   TODO("see RecipeRepository 'deserializeIngredientsSections'")
}