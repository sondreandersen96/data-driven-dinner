package no.sondre.domain

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.ws.rs.BadRequestException
import jakarta.ws.rs.InternalServerErrorException
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*

@NoArg
abstract class Domain {

    var id: UUID? = null

    companion object {
        private val objectMapper = ObjectMapper()
        val TIMEZONE = ZoneId.of("Europe/Oslo")

        fun now(): ZonedDateTime {
            return ZonedDateTime.now(TIMEZONE)
        }
    }

    open fun initNew() {
        assertNoId()
        id = UUID.randomUUID()
    }

    private val hasId: Boolean
        get() = id != null

    fun idSafe(): UUID {
        assertId()
        return id!!
    }

    fun assertId() {
        if (!hasId) {
            throw InternalServerErrorException("No id set on object")
        }
    }

    fun assertId(id: UUID) {
        if (id != this.idSafe()) {
            throw BadRequestException("Object with id: ${this.idSafe()} cannot update resource with id: $id")
        }
    }

    private fun assertNoId() {
        if (hasId) {
            throw InternalServerErrorException("Id already set on object")
        }
    }

    fun withId(id: UUID) {
        if (!hasId) this.id = id
    }

    fun toJsonString(): String {
        val printer = objectMapper.writer().withDefaultPrettyPrinter()
        return printer.writeValueAsString(this)
    }

    abstract fun copy(): Domain
}
