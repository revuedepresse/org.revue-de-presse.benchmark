package org.revue_2_presse.data.api

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class HydraHighlight(
    @SerialName("@id") val id: String,
    val publicationId: String,
    val screenName: String,
    val avatarUrl: String? = null,
    val text: String,
    val reposts: Int = 0,
    val likes: Int = 0,
    val replies: Int = 0,
    val date: String,
    val url: String,
)

@Serializable
data class HydraSource(
    @SerialName("@id") val id: String,
    val screenName: String,
    val displayName: String,
    val avatarUrl: String? = null,
    val firstSeenAt: String,
    val highlightsCount: Int = 0,
)

@Serializable
data class HydraCollection<T>(
    @SerialName("@context") val context: String? = null,
    @SerialName("@id") val id: String? = null,
    @SerialName("@type") val type: String? = null,
    @SerialName("hydra:totalItems") val totalItems: Int? = null,
    @SerialName("hydra:member") val member: List<T> = emptyList(),
)

@Serializable
data class HydraDeviceToken(
    @SerialName("@context") val context: String? = null,
    @SerialName("@id") val id: String? = null,
    val token: String,
    val expiresInSec: Int,
    val scopes: List<String> = emptyList(),
)

@Serializable
data class HydraError(
    @SerialName("@context") val context: String? = null,
    @SerialName("hydra:title") val title: String? = null,
    @SerialName("hydra:description") val description: String? = null,
    val status: Int? = null,
)
