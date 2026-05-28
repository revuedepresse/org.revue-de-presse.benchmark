package org.revue_2_presse.data.api

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonNames

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

// JSON-LD's @context, @id, @type are objects when the API serves application/ld+json,
// strings otherwise. We never read them downstream, so they're omitted here and skipped
// by Json { ignoreUnknownKeys = true } in KtorClientFactory. Re-introducing typed
// fields means using JsonElement to tolerate both shapes — don't.
//
// Hydra v3 (API Platform 4 default) drops the "hydra:" prefix on totalItems / member;
// older fixtures + earlier versions kept the prefix. @JsonNames accepts both shapes
// at deserialisation so production responses and existing JSON fixtures both decode.
@OptIn(ExperimentalSerializationApi::class)
@Serializable
data class HydraCollection<T>(
    @JsonNames("hydra:totalItems") val totalItems: Int? = null,
    @JsonNames("hydra:member") val member: List<T> = emptyList(),
)

@Serializable
data class HydraDeviceToken(
    val token: String,
    val expiresInSec: Int,
    val scopes: List<String> = emptyList(),
)

@Serializable
data class HydraError(
    @SerialName("hydra:title") val title: String? = null,
    @SerialName("hydra:description") val description: String? = null,
    val status: Int? = null,
)
