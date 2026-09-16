package no.sondre.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.transaction.Transactional
import no.sondre.domain.ShoppingList
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.ZonedDateTime
import java.util.UUID

@Entity
@Table(name = "shopping_list")
class SQLShoppingList(
    @Id
    val id: UUID,
    val name: String,
    @Column(name = "\"shoppingItems\"", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    val shoppingItems: String,
    val created: ZonedDateTime
) : SQLModel<ShoppingList> {
    override fun toPOJO(): ShoppingList {
        TODO("Not yet implemented")
    }

    override fun update(new: ShoppingList) {
        TODO("Not yet implemented")
    }

    companion object : SQLModelCreator<ShoppingList, SQLShoppingList> {
        override fun fromPOJO(pojo: ShoppingList): SQLShoppingList {
            TODO("Not yet implemented")
        }

    }
}



@ApplicationScoped
@Transactional
class ShoppingListRepostory : PanacheRepository<SQLShoppingList> {

    fun new(sl: ShoppingList) {

    }
}