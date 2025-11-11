package no.sondre.domain

class Recipe(
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
        ingredients.forEach { it.populate(idSafe())}
    }

    // Properties must be changed using a function so that Hibernate proxy will work
    // https://stackoverflow.com/questions/64503946/update-entity-data-using-quarkus-and-panacherepository-is-not-working
    // this is only fair code-wise, however if the entity extends PanacheEntity it will provide getters/setters behind the scene
    // TOOD: consider making all fields private to avoid such mistakes/bad pattern
    fun addIngredient(i: RecipeIngredient) {
        i.populate(idSafe())
        ingredients.add(i)
    }


    // Should only be used for test methods
    fun _addIngredientWithoutId(i: RecipeIngredient) {
        ingredients.add(i)
    }
}
