package no.sondre.domain

data class RecipeIngredient(
    var amount: Double,
    val unit: String,
    var ingredient: Ingredient,
) {
}
