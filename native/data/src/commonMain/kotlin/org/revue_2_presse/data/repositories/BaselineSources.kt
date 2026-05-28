package org.revue_2_presse.data.repositories

import kotlinx.datetime.LocalDate
import org.revue_2_presse.data.mappers.DeriveAuthorName
import org.revue_2_presse.domain.entities.Source

// Canonical roster of French press Bluesky accounts the project tracks. The API
// `derives` the source list from the 90-day highlights window, so any account
// that hasn't been highlighted recently disappears from /sources. This baseline
// is merged in by SourcesRepositoryImpl so the full roster is always visible,
// even if some media haven't published recently.
internal object BaselineSources {

    private val screenNames: List<String> = listOf(
        "afp.com",
        "bfmtv.com",
        "blast-info.fr",
        "challengesfr.bsky.social",
        "charliehebdo.fr",
        "courrierinter.bsky.social",
        "franceculture.fr",
        "france24.com",
        "humanite.fr",
        "la-croix.com",
        "lavoixdunord.fr",
        "lefigaro.fr",
        "lecanardenchaine.fr",
        "lemonde.fr",
        "afrique.lemonde.fr",
        "lepoint.fr",
        "lesechosfr.bsky.social",
        "lesjours.fr",
        "liberation.fr",
        "mediapart.fr",
        "monde-diplomatique.fr",
        "nouvelobs.com",
        "ouest-france.fr",
        "pixelsfr.bsky.social",
        "rfi.fr",
        "telerama.bsky.social",
    )

    // Placeholder firstSeenAt for baseline entries whose API record is absent.
    // The project's archive floor (2025-03-04) is the reasonable conservative
    // lower bound — these accounts existed at or before that point.
    private val placeholderFirstSeenAt: LocalDate = LocalDate(2025, 3, 4)

    fun asSources(): List<Source> = screenNames.map { handle ->
        Source(
            screenName = handle,
            displayName = DeriveAuthorName.from(handle),
            avatarUrl = null,
            firstSeenAt = placeholderFirstSeenAt,
            highlightsCount = 0,
        )
    }
}
