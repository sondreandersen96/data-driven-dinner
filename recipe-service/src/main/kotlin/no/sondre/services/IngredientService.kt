package no.sondre.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import no.sondre.repository.IngredientRepository
import no.sondre.domain.Ingredient
import java.util.*

@ApplicationScoped
@Transactional
class IngredientService {

    @Inject
    private lateinit var repo: IngredientRepository

    fun list(): List<Ingredient> {
        return repo.all()
    }

    fun load(id: UUID): Ingredient {
        return repo.findById(id)
    }

    fun load(ids: List<UUID>): List<Ingredient> {
        return repo.findById(ids)
    }

    fun save(ingredient: Ingredient): Ingredient {
        ingredient.initNew()
        return repo.save(ingredient)
    }

    fun update(new: Ingredient): Ingredient {
        return repo.update(new)
    }
}