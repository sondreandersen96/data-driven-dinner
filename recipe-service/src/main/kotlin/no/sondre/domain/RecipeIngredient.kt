package no.sondre.domain

import java.util.*

class RecipeIngredient(
    val amount: Int,
    val unit: String,
    val ingredient: Ingredient,
) {
    var recipe: UUID = unInitializedUUID()

    fun populate(recipeId: UUID) {
        check(needsToBeInitialized()) { "Recipe is already set on recipe-ingredient" }
        this.recipe = recipeId
    }

    fun needsToBeInitialized() = recipe.needsToBeInitialized()
}
