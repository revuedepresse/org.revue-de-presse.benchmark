package org.revue_2_presse.data.auth

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.test.runTest
import kotlinx.datetime.Instant
import kotlinx.serialization.json.Json
import org.revue_2_presse.domain.entities.DeviceToken
import org.revue_2_presse.domain.repositories.DeviceTokenStore
import kotlin.test.Test
import kotlin.test.assertEquals

class DeviceTokenInterceptorTest {

    private class FakeTokenStore : DeviceTokenStore {
        var currentToken: String = "abc"
        var currentCalls = 0
        var invalidateCalls = 0

        override suspend fun current(): DeviceToken {
            currentCalls++
            return DeviceToken(raw = currentToken, expiresAt = Instant.fromEpochSeconds(99999999999L))
        }

        override suspend fun invalidate() {
            invalidateCalls++
            currentToken = "new"
        }
    }

    @Test
    fun attaches_bearer_token_to_request() = runTest {
        var seenAuthHeader: String? = null
        val engine = MockEngine { req ->
            seenAuthHeader = req.headers[HttpHeaders.Authorization]
            respond("[]", HttpStatusCode.OK, headersOf(HttpHeaders.ContentType, "application/json"))
        }
        val store = FakeTokenStore()
        val client = buildClient(engine, store)
        client.get("https://api.example.test/api/highlights")
        assertEquals("Bearer abc", seenAuthHeader)
    }

    @Test
    fun retries_once_on_401_with_freshly_minted_token() = runTest {
        var callCount = 0
        val engine = MockEngine { req ->
            callCount++
            val auth = req.headers[HttpHeaders.Authorization]
            if (auth == "Bearer abc") respond("", HttpStatusCode.Unauthorized)
            else respond("[]", HttpStatusCode.OK, headersOf(HttpHeaders.ContentType, "application/json"))
        }
        val store = FakeTokenStore()
        val client = buildClient(engine, store)
        val response = client.get("https://api.example.test/api/highlights")
        assertEquals(2, callCount, "must retry once")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals(1, store.invalidateCalls)
    }

    @Test
    fun surfaces_unauthorized_after_second_401() = runTest {
        val engine = MockEngine { _ ->
            respond("", HttpStatusCode.Unauthorized)
        }
        val store = FakeTokenStore()
        val client = buildClient(engine, store)
        val response = client.get("https://api.example.test/api/highlights")
        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }

    private fun buildClient(engine: MockEngine, store: DeviceTokenStore): HttpClient =
        HttpClient(engine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            install(DeviceTokenInterceptor) {
                tokenStore = store
                baseUrl = "https://api.example.test"
            }
        }
}
