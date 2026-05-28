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
}
