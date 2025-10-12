package no.sondre.domain

class Ingredient(
    var name: String,
) : Domain() {
    fun update(new: Ingredient) {
        name = new.name
    }
}
