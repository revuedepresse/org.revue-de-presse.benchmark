package org.revue_2_presse.data.api

import kotlinx.datetime.LocalDate

class ApiEndpoints(val baseUrl: String) {
    fun deviceTokens() = "$baseUrl/api/device-tokens"
    fun highlights(start: LocalDate, end: LocalDate, itemsPerPage: Int = 10) =
        "$baseUrl/api/highlights?startDate=$start&endDate=$end" +
        "&distinctSources=1&includeRetweets=0&excludeMedia=1&itemsPerPage=$itemsPerPage"
    fun sources() = "$baseUrl/api/sources"
    fun source(slug: String) = "$baseUrl/api/sources/$slug"
}
