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

    @Test fun forDay_emits_failure_on_api_error() = runTest {
        val engine = MockEngine { throw RuntimeException("network error") }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = HighlightsRepositoryImpl(api)

        repo.forDay(LocalDate(2026, 5, 1)).test {
            // first emission is the empty cache hit (success)
            val first = awaitItem()
            assertTrue(first.isSuccess)
            // second emission is the caught API error
            val second = awaitItem()
            assertTrue(second.isFailure)
            awaitComplete()
        }
    }

    @Test fun forRange_emits_mapped_results() = runTest {
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

        repo.forRange(LocalDate(2026, 5, 1), LocalDate(2026, 5, 7)).test {
            val result = awaitItem()
            assertTrue(result.isSuccess)
            assertEquals(3, result.getOrThrow().size)
            awaitComplete()
        }
    }

    @Test fun forRange_emits_failure_on_api_error() = runTest {
        val engine = MockEngine { throw RuntimeException("network error") }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = HighlightsRepositoryImpl(api)

        repo.forRange(LocalDate(2026, 5, 1), LocalDate(2026, 5, 7)).test {
            val result = awaitItem()
            assertTrue(result.isFailure)
            awaitComplete()
        }
    }

    @Test fun refresh_updates_cached_value() = runTest {
        var callCount = 0
        val engine = MockEngine {
            callCount++
            respond(
                content = HighlightsFixtures.json("hydra-highlights-fr-2026-05-01.json"),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = HighlightsRepositoryImpl(api)

        val day = LocalDate(2026, 5, 1)
        repo.refresh(day)
        assertEquals(1, callCount)

        // After refresh, forDay should emit the cached result first, then re-fetch
        repo.forDay(day).test {
            val first = awaitItem()
            assertTrue(first.isSuccess)
            assertEquals(3, first.getOrThrow().size, "cache populated by refresh")
            awaitItem() // second emission from API re-fetch
            awaitComplete()
        }
    }
}

object HighlightsFixtures {
    fun json(name: String): String =
        HighlightsFixtures::class.java.classLoader!!.getResourceAsStream("fixtures/$name")!!.bufferedReader().readText()
}
