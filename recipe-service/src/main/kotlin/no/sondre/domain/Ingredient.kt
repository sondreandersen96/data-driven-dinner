package no.sondre.domain

import java.util.UUID

class Ingredient(
    var name: String,
) : Domain() {
    companion object {
        fun uninitializedWithId(id: UUID): Ingredient {
            val i = Ingredient(name = "")
            i.withId(id)
            return i
        }
    }

    fun populate(name: String) {
        this.name = name
    }
}
