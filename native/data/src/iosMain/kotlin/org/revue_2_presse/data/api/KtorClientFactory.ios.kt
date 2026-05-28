package org.revue_2_presse.data.api

import io.ktor.client.HttpClient
import io.ktor.client.HttpClientConfig
import io.ktor.client.engine.darwin.Darwin
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

actual class KtorClientFactory {
    actual fun create(extraConfig: HttpClientConfig<*>.() -> Unit): HttpClient =
        HttpClient(Darwin) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
            extraConfig()
        }
}
