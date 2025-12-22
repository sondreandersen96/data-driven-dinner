package no.sondre.domain

data class Recipe(
    var name: String,
    var youtube: String? = null,
    val ingredients: MutableList<RecipeIngredient> = mutableListOf(),
    val description: String,
    var portions: Int
) : Domain() {

    companion object {
        val STANDARD_PORTION_SIZE = 4
    }

    override fun initNew() {
        super.initNew()
        populateRecipeIngredients()
        standardizePortion()
    }

    private fun standardizePortion() {
        adjustPortion(STANDARD_PORTION_SIZE)
    }

    fun adjustPortion(new: Int) {
        val adjustmentFactor = new / portions
        ingredients.forEach {
            it.amount *= adjustmentFactor
        }
        portions = new
    }

    fun prepareUpdate() {
        adjustPortion(STANDARD_PORTION_SIZE)
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
