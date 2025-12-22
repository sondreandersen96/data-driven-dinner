package no.sondre.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import no.sondre.domain.Recipe
import no.sondre.repository.RecipeRepository
import java.util.*

@ApplicationScoped
class RecipeService {

    @Inject
    private lateinit var repo: RecipeRepository

    fun list(query: String = ""): List<Recipe> {
        return repo.all(query)
    }

    fun load(id: UUID, portions: Int? = Recipe.STANDARD_PORTION_SIZE): Recipe {
        val recipe = repo.findById(id)
        portions?.let { recipe.adjustPortion(portions) }
        return recipe
    }

    fun new(recipe: Recipe): Recipe {
        recipe.initNew()
        repo.new(recipe)
        return recipe
    }

    fun update(new: Recipe): Recipe {
        new.prepareUpdate()
        return repo.update(new)
    }

    fun delete(id: UUID) {
        val recipe = load(id)
        repo.delete(recipe)
    }
}