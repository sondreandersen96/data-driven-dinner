package no.sondre.repository

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.sondre.domain.Ingredient
import no.sondre.domain.Recipe
import no.sondre.domain.RecipeIngredient
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class SQLRecipeTest {
    @Test
    fun deserializeIngredientsSections() {


    }

    @Test
    fun serializeIngredientsSections() {
        val om = jacksonObjectMapper()

        val ingredient = Ingredient("Agurk")
        ingredient.initNew()

        val serialized = SQLRecipe.serialize(
            mutableMapOf(
                "main" to listOf(RecipeIngredient(
                    amount = 1.0,
                    unit = "stones",
                    ingredient = ingredient
                ))
            )
        )

        val expected = om.writeValueAsString(mapOf(
            "main" to listOf(mapOf("amount" to 1.0, "unit" to "stones", "ingredient" to ingredient.id)),
        ))
        assert(serialized == expected)
    }

}