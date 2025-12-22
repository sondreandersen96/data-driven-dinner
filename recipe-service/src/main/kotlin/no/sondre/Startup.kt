package no.sondre

import io.quarkus.arc.profile.IfBuildProfile
import io.quarkus.runtime.StartupEvent
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import no.sondre.domain.Ingredient
import no.sondre.domain.Recipe
import no.sondre.domain.RecipeIngredient
import no.sondre.repository.SQLRecipe
import no.sondre.repository.IngredientRepository
import no.sondre.repository.RecipeIngredientId
import no.sondre.repository.RecipeRepository
import no.sondre.repository.SQLIngredient
import no.sondre.resources.IngredientResource
import no.sondre.resources.RecipeResource
import java.util.*
import java.util.logging.Logger

@IfBuildProfile("dev")
@ApplicationScoped
class Startup {

    @Inject
    private lateinit var ingredientResource: IngredientResource

    @Inject
    private lateinit var recipeResource: RecipeResource

    private val logger = Logger.getLogger("Startup logger")

    //@Transactional
    fun injectTestData(@Observes event: StartupEvent) {
        logger.info("Injecting some test data")
        val ingredients = listOf(
            Ingredient("Brokkoli"),
            Ingredient("Brokkolini"),
            Ingredient("Tomat"),
            Ingredient("Agurk"),
            Ingredient("Hvitløk"),
            Ingredient("Gul løk"),
            Ingredient("Rød løk"),
            Ingredient("Paprika"),
            Ingredient("Søt paprika"),
            Ingredient("Chilli (fersk)"),
            Ingredient("Kjøttdeig"),
            Ingredient("Kyllingfilet"),
            Ingredient("Ingefær"),
            Ingredient("Persille"),
            Ingredient("Salt"),
            Ingredient("Pepper"),
        )
        val recipeIngredient1 = RecipeIngredient(
            amount = 1,
            unit = "stones",
            ingredient = ingredients[0]
        )
        val recipeIngredient2 = RecipeIngredient(
            amount = 1,
            unit = "stones",
            ingredient = ingredients[1]
        )
        val recipes = listOf(
            Recipe(
                name = "recipe one",
                youtube = "https://www.youtube.com/watch?v=JYg1UfVCfiw",
                ingredients = mutableListOf(),
                description = "beskrivelse",
                portions = 4,
            ),
            Recipe("recipe two", ingredients = mutableListOf(recipeIngredient1), description = "beskrivelse", portions = 4),
            Recipe("recipe three", ingredients = mutableListOf(recipeIngredient2), description = "beskrivelse", portions = 4),
            Recipe(
                "recipe four",
                ingredients = mutableListOf(recipeIngredient1, recipeIngredient2),
                description = "beskrivelse",
                portions = 4,
            ),
            Recipe("recipe five", ingredients = mutableListOf(), description = "beskrivelse", portions = 4)
        )
        ingredients.forEach { ingredientResource.save(it) }
        recipes.forEach {
            recipeResource.save(it.copy())
        }
    }
}
