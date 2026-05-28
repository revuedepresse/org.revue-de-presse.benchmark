package org.revue_2_presse.domain.entities

import kotlinx.serialization.Serializable

@Serializable
data class SourceDetail(
    val source: Source,
    val recentHighlights: List<Highlight>,
)
