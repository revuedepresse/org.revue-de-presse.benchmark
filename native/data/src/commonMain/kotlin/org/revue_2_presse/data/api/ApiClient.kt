package org.revue_2_presse.data.api

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class DeviceTokenRequest(val platform: String, val appVersion: String, val installId: String)

class ApiClient(private val http: HttpClient, private val endpoints: ApiEndpoints) {
    suspend fun mintDeviceToken(req: DeviceTokenRequest): HydraDeviceToken =
        http.post(endpoints.deviceTokens()) {
            contentType(ContentType.parse("application/ld+json"))
            accept(ContentType.parse("application/ld+json"))
            setBody(req)
        }.body()

    suspend fun highlights(start: LocalDate, end: LocalDate): HydraCollection<HydraHighlight> =
        http.get(endpoints.highlights(start, end)) {
            accept(ContentType.parse("application/ld+json"))
        }.body()

    suspend fun sources(): HydraCollection<HydraSource> =
        http.get(endpoints.sources()) {
            accept(ContentType.parse("application/ld+json"))
        }.body()
}
