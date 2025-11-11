package no.sondre.domain

data class Recipe(
    var name: String,
    var youtube: String? = null,
    val ingredients: MutableList<RecipeIngredient> = mutableListOf(),
    val description: String
) : Domain() {

    override fun initNew() {
        super.initNew()
        populateRecipeIngredients()
    }

    fun prepareUpdate() {
        populateRecipeIngredients()
    }

    private fun populateRecipeIngredients() {
        ingredients.forEach { it.populate(idSafe()) }
    }


    fun addIngredient(i: RecipeIngredient) {
        i.populate(idSafe())
        ingredients.add(i)
    }


    // Should only be used for test methods
    fun _addIngredientWithoutId(i: RecipeIngredient) {
        ingredients.add(i)
    }

    override fun copy(): Recipe {
        return this.copy(ingredients = this.ingredients.map { it.copy() }.toMutableList())
    }
}
