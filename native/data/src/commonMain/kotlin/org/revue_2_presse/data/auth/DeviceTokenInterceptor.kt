package org.revue_2_presse.data.auth

import io.ktor.client.plugins.api.Send
import io.ktor.client.plugins.api.createClientPlugin
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import org.revue_2_presse.domain.repositories.DeviceTokenStore

class DeviceTokenInterceptorConfig {
    lateinit var tokenStoreProvider: () -> DeviceTokenStore
    lateinit var baseUrl: String
}

val DeviceTokenInterceptor = createClientPlugin("DeviceTokenInterceptor", ::DeviceTokenInterceptorConfig) {

    val storeProvider = pluginConfig.tokenStoreProvider
    val baseUrl = pluginConfig.baseUrl

    onRequest { request, _ ->
        if (request.url.buildString().startsWith("$baseUrl/api/device-tokens")) return@onRequest
        val token = storeProvider().current().raw
        request.headers[HttpHeaders.Authorization] = "Bearer $token"
    }

    on(Send) { request ->
        val originalCall = proceed(request)
        if (originalCall.response.status != HttpStatusCode.Unauthorized) return@on originalCall
        if (request.url.buildString().startsWith("$baseUrl/api/device-tokens")) return@on originalCall

        val store = storeProvider()
        store.invalidate()
        val freshToken = store.current().raw
        request.headers[HttpHeaders.Authorization] = "Bearer $freshToken"
        proceed(request)
    }
}
