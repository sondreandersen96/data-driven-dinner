package no.sondre.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException
import no.sondre.domain.Ingredient
import java.util.*

@Entity
@Table(name="ingredient")
class SQLIngredient(
    @Id
    val id: UUID,
    var name: String,
) : SQLModel<Ingredient> {
    companion object : SQLModelCreator<Ingredient, SQLIngredient> {
        override fun fromPOJO(pojo: Ingredient): SQLIngredient {
            pojo.assertId()
            return SQLIngredient(pojo.idSafe(), pojo.name)
        }
    }

    override fun toPOJO(): Ingredient {
        val pojo = Ingredient(name)
        pojo.withId(id)
        return pojo
    }

    override fun update(new: Ingredient) {
        name = new.name
    }
}

@ApplicationScoped
@Transactional
class IngredientRepository : PanacheRepository<SQLIngredient> {
    fun findById(id: UUID): Ingredient {
        val sql = findSQLById(id)
        return sql.toPOJO()
    }

    fun findById(ids: List<UUID>): List<Ingredient> {
        val sqls = list("id in ?1", ids)
        return sqls.map { it.toPOJO() }
    }

    private fun findSQLById(id: UUID): SQLIngredient {
        return find("id", id).firstResult() ?: throw NotFoundException("Ingredient with ID $id not found")
    }

    fun all(): List<Ingredient> {
        return listAll().map { it.toPOJO() }
    }

    fun save(ingredient: Ingredient): Ingredient {
        val sql = SQLIngredient.fromPOJO(ingredient)
        persist(sql)
        return ingredient
    }

    fun update(new: Ingredient): Ingredient {
        val current = findSQLById(new.idSafe())
        current.update(new)
        return current.toPOJO()
    }
}
