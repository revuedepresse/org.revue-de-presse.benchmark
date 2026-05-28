package org.revue_2_presse.domain.entities

import kotlinx.datetime.LocalDate
import kotlinx.serialization.Serializable

@Serializable
data class Source(
    val screenName: String,
    val displayName: String,
    val avatarUrl: String?,
    val firstSeenAt: LocalDate,
    val highlightsCount: Int,
) {
    init { require(screenName.isNotBlank()) { "Source.screenName must not be blank" } }
}
