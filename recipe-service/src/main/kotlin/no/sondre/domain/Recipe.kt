package no.sondre.domain

data class Recipe(
    var name: String,
    var youtube: String? = null,
    val ingredientsSections: MutableMap<String, List<RecipeIngredient>> = mutableMapOf(),
    val description: String,
    var portions: Int,
    var draft: Boolean = false
) : Domain() {

    // Will be serialized and is used by frontend
    val thumbnailUrl: String get() {
        return if (youtube != null && youtube!!.isNotBlank()) {
            "https://img.youtube.com/vi/$youtube/maxresdefault.jpg"
        } else {
            ""
        }
    }

    companion object {
        val STANDARD_PORTION_SIZE = 4
    }

    override fun initNew() {
        super.initNew()
        extractYoutubeId()
        standardizePortion()
    }

    private fun extractYoutubeId() {
        if (youtube?.contains("v=") ?: false) {
            youtube = youtube!!.split("v=").last()
            if (youtube!!.contains("&")) {
                youtube = youtube!!.split("&").first()
            }
        }
    }

    private fun standardizePortion() {
        adjustPortion(STANDARD_PORTION_SIZE)
    }

    fun adjustPortion(new: Int) {
        val adjustmentFactor = new / portions.toDouble()
        ingredientsSections.forEach {
            it.value.forEach { re -> re.amount *= adjustmentFactor }
        }
        portions = new
    }

    fun prepareUpdate() {
        adjustPortion(STANDARD_PORTION_SIZE)
    }

    fun allRecipeIngredients(): List<RecipeIngredient> {
        return ingredientsSections.flatMap { it.value }
    }

    override fun copy(): Recipe {
        return this.copy(ingredientsSections = this.ingredientsSections.toMutableMap())
    }
}
