package org.revue_2_presse.data.api

import io.ktor.client.HttpClient
import io.ktor.client.HttpClientConfig

expect class KtorClientFactory() {
    fun create(extraConfig: HttpClientConfig<*>.() -> Unit = {}): HttpClient
}
