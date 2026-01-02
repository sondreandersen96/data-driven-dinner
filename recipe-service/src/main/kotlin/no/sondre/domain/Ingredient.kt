package no.sondre.domain

import java.util.UUID

data class Ingredient(
    var name: String,
) : Domain() {
    companion object {
        fun uninitializedWithId(id: UUID): Ingredient {
            val i = Ingredient(name = "")
            i.withId(id)
            return i
        }
    }

    override fun copy(): Ingredient {
        return this.copy()
    }
}
