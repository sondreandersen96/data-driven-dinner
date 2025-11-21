package no.sondre.domain

import java.util.*

data class RecipeIngredient(
    val amount: Int,
    val unit: String,
    var ingredient: Ingredient,
) {
    var recipe: UUID = unInitializedUUID()

    fun populate(recipeId: UUID) {
        check(needsToBeInitialized()) { "Recipe is already set on recipe-ingredient" }
        this.recipe = recipeId
    }

    fun populate(ingredient: Ingredient) {
        this.ingredient = ingredient
    }

    fun needsToBeInitialized() = recipe.needsToBeInitialized()
}
