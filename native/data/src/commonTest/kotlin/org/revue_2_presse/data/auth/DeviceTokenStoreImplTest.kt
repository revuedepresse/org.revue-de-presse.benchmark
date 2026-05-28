package org.revue_2_presse.data.auth

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.test.runTest
import kotlinx.datetime.Instant
import kotlinx.serialization.json.Json
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.api.ApiEndpoints
import org.revue_2_presse.domain.repositories.InstallIdStore
import kotlin.test.Test
import kotlin.test.assertEquals

class DeviceTokenStoreImplTest {

    private class FakeInstallIdStore(private var id: String = "install-001") : InstallIdStore {
        var rotateCalls = 0
        override suspend fun current(): String = id
        override suspend fun rotate(): String {
            rotateCalls++
            id = "install-rotated"
            return id
        }
    }

    private fun mockHttpClient(
        vararg responses: Pair<HttpStatusCode, String>,
    ): HttpClient {
        val queue = ArrayDeque(responses.toList())
        val engine = MockEngine { _ ->
            val (status, body) = queue.removeFirst()
            respond(
                content = body,
                status = status,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        return HttpClient(engine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
    }

    private fun storeWithHttp(
        http: HttpClient,
        installIds: InstallIdStore = FakeInstallIdStore(),
        clock: () -> Instant = { Instant.fromEpochSeconds(1_000_000L) },
    ) = DeviceTokenStoreImpl(
        api = ApiClient(http, ApiEndpoints("https://api.example.test")),
        installIds = installIds,
        platform = "jvm",
        appVersion = "1.0",
        clock = clock,
    )

    @Test fun current_mints_token_on_first_call() = runTest {
        val http = mockHttpClient(
            HttpStatusCode.OK to """{"token":"fresh","expiresInSec":3600}""",
        )
        val store = storeWithHttp(http)
        val token = store.current()
        assertEquals("fresh", token.raw)
    }

    @Test fun current_returns_cached_token_on_second_call() = runTest {
        var callCount = 0
        val engine = MockEngine { _ ->
            callCount++
            respond(
                content = """{"token":"cached-tok","expiresInSec":3600}""",
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val http = HttpClient(engine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
        val store = storeWithHttp(http)
        store.current()
        store.current()
        assertEquals(1, callCount, "API must be called only once; second call should hit cache")
    }

    @Test fun invalidate_clears_cached_token() = runTest {
        var callCount = 0
        val engine = MockEngine { _ ->
            callCount++
            respond(
                content = """{"token":"tok-$callCount","expiresInSec":3600}""",
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val http = HttpClient(engine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
        val store = storeWithHttp(http)
        store.current()
        store.invalidate()
        store.current()
        assertEquals(2, callCount, "After invalidate a fresh mint must occur")
    }

    @Test fun mint_rotates_install_id_and_retries_on_exception() = runTest {
        var callCount = 0
        val engine = MockEngine { _ ->
            callCount++
            if (callCount == 1) throw RuntimeException("network error simulating 403")
            respond(
                content = """{"token":"rotated-tok","expiresInSec":3600}""",
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json"),
            )
        }
        val http = HttpClient(engine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
        val installIds = FakeInstallIdStore()
        val store = storeWithHttp(http, installIds)
        val token = store.current()
        assertEquals("rotated-tok", token.raw)
        assertEquals(1, installIds.rotateCalls, "install-id must be rotated once on first failure")
    }
}
