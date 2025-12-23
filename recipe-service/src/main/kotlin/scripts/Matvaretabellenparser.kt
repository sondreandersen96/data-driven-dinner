import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

// TODO: just add this to the main application code and read on startup (it is fast)
data class Model(
    val foods: List<Food>
) {
    fun removeEmptyConsituents() {
        foods.forEach { food ->
            food.constituents = food.constituents?.filter { it ->
                it.quantity != null && it.quantity != 0.0
            }
        }
    }
}

data class Food(
    val foodId: String,
    val foodName: String,
    val searchKeywords: List<String>? = null,
    val calories: Calories? = null,
    val energy: Energy? = null,
    var constituents: List<Constituent>? = null,
    val portions: List<Portion>? = null,
    val uri: String? = null,
    val foodGroupId: String? = null
)

data class Calories(
    val sourceId: String?,
    val quantity: Double?,
    val unit: String?
)

data class Energy(
    val sourceId: String?,
    val quantity: Double?,
    val unit: String?
)

data class Constituent(
    val sourceId: String?,
    val nutrientId: String?,
    val quantity: Double? = null,
    val unit: String? = null
)

data class Portion(
    val portionName: String?,
    val portionUnit: String?,
    val quantity: Double?,
    val unit: String?
)

class MatvaretabellenParser {
    fun parse(): Model {
        val inputStream = this::class.java.getResourceAsStream("/matvaretabellen_23_12_2025.json")
            ?: throw IllegalStateException("Could not find resource file")

        val mapper: ObjectMapper = jacksonObjectMapper().apply {
            // Ignore unknown properties (including langualCodes and ediblePart)
            configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        }

        return inputStream.use { stream ->
            mapper.readValue(stream)
        }
    }
}

fun main() {
    val parser = MatvaretabellenParser()
    val model = parser.parse()
    model.removeEmptyConsituents()

    println("Loaded ${model.foods.size} foods")
    println(model.foods[0])
}