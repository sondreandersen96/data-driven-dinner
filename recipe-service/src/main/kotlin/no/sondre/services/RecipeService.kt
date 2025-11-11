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

    fun list(): List<Recipe> {
        return repo.all()
    }

    fun load(id: UUID): Recipe {
        return repo.findByIdOrThrow(id)
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
}