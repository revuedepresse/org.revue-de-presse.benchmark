package org.revue_2_presse.data.repositories

import app.cash.turbine.test
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.test.runTest
import kotlinx.datetime.Instant
import kotlinx.serialization.json.Json
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.api.ApiEndpoints
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SourcesRepositoryImplTest {
    @Test fun all_returns_deduplicated_sources_grouped_by_handle() = runTest {
        val engine = MockEngine {
            respond(
                content = HighlightsFixtures.json("hydra-highlights-fr-2026-05-01.json"),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = SourcesRepositoryImpl(api = api, clock = { Instant.parse("2026-05-01T00:00:00Z") })

        repo.all().test {
            val result = awaitItem()
            assertTrue(result.isSuccess)
            val sources = result.getOrThrow()
            // Fixture has 3 distinct handles → 3 sources
            assertEquals(3, sources.size)
            awaitComplete()
        }
    }

    @Test fun all_emits_failure_on_api_error() = runTest {
        val engine = MockEngine { throw RuntimeException("network error") }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = SourcesRepositoryImpl(api = api, clock = { Instant.parse("2026-05-01T00:00:00Z") })

        repo.all().test {
            val result = awaitItem()
            assertTrue(result.isFailure)
            awaitComplete()
        }
    }

    @Test fun forSlug_returns_detail_for_known_handle() = runTest {
        val engine = MockEngine {
            respond(
                content = HighlightsFixtures.json("hydra-highlights-fr-2026-05-01.json"),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = SourcesRepositoryImpl(api = api, clock = { Instant.parse("2026-05-01T00:00:00Z") })

        repo.forSlug("franceculture.fr").test {
            val result = awaitItem()
            assertTrue(result.isSuccess)
            val detail = result.getOrThrow()
            assertEquals("franceculture.fr", detail.source.screenName)
            assertEquals(1, detail.recentHighlights.size)
            awaitComplete()
        }
    }

    @Test fun forSlug_emits_failure_for_unknown_handle() = runTest {
        val engine = MockEngine {
            respond(
                content = HighlightsFixtures.json("hydra-highlights-fr-2026-05-01.json"),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val client = HttpClient(engine) { install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) } }
        val api = ApiClient(client, ApiEndpoints("https://api.example.test"))
        val repo = SourcesRepositoryImpl(api = api, clock = { Instant.parse("2026-05-01T00:00:00Z") })

        repo.forSlug("unknown.example.com").test {
            val result = awaitItem()
            assertTrue(result.isFailure)
            assertTrue(result.exceptionOrNull()?.message?.contains("source not found") == true)
            awaitComplete()
        }
    }
}
