package org.revue_2_presse.data.repositories

import app.cash.turbine.test
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.test.runTest
import kotlinx.datetime.LocalDate
import kotlinx.serialization.json.Json
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.api.ApiEndpoints
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HighlightsRepositoryImplTest {

    @Test fun forDay_emits_empty_then_mapped() = runTest {
        val engine = MockEngine {
            respond(
                content = HighlightsFixtures.json("hydra-highlights-fr-2026-05-01.json"),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = HighlightsRepositoryImpl(api)

        repo.forDay(LocalDate(2026, 5, 1)).test {
            val first = awaitItem()
            assertTrue(first.isSuccess); assertEquals(0, first.getOrThrow().size)
            val second = awaitItem()
            assertTrue(second.isSuccess); assertEquals(3, second.getOrThrow().size)
            awaitComplete()
        }
    }
}

object HighlightsFixtures {
    fun json(name: String): String =
        HighlightsFixtures::class.java.classLoader!!.getResourceAsStream("fixtures/$name")!!.bufferedReader().readText()
}
