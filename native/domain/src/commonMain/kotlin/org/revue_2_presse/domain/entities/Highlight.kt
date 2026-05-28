package org.revue_2_presse.domain.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class Highlight(
    val id: String,
    val authorName: String,
    val authorHandle: String,
    val authorAvatarUrl: String?,
    val body: String,
    val publishedAt: Instant,
    val metrics: Metrics,
    val url: String,
) {
    init { require(id.isNotBlank()) { "Highlight.id must not be blank" } }
}

@Serializable
data class Metrics(
    val replies: Int = 0,
    val reposts: Int = 0,
    val likes: Int = 0,
)
