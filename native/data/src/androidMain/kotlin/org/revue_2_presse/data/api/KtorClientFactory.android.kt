package org.revue_2_presse.data.api

import io.ktor.client.HttpClient
import io.ktor.client.HttpClientConfig
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

// Android has no java.net.http (the JVM/Java engine) and CIO's own TLS stack
// can't negotiate TLS 1.3 with prod nginx; OkHttp uses the platform TLS, which
// speaks TLS 1.3 on the API 34 target.
actual class KtorClientFactory {
    actual fun create(extraConfig: HttpClientConfig<*>.() -> Unit): HttpClient =
        HttpClient(OkHttp) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true; encodeDefaults = false })
            }
            install(Logging) { level = io.ktor.client.plugins.logging.LogLevel.INFO }
            extraConfig()
        }
}
