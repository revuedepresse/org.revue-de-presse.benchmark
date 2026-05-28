package org.revue_2_presse.data.repositories

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import kotlinx.datetime.*
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.mappers.HydraToHighlight
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.entities.SourceDetail
import org.revue_2_presse.domain.repositories.SourcesRepository

class SourcesRepositoryImpl(
    private val api: ApiClient,
    private val clock: () -> Instant = { Clock.System.now() },
) : SourcesRepository {

    override fun all(): Flow<Result<List<Source>>> = flow {
        emit(Result.success(mergeWithBaseline(deriveFromHighlightsWindow())))
    }.catch { emit(Result.failure(it)) }

    // Merge the canonical roster with whatever the highlights window produced —
    // API entries take precedence (they carry real displayName + avatarUrl +
    // highlightsCount), baseline fills in any media that haven't been featured
    // recently so the Sources page never silently drops them.
    private fun mergeWithBaseline(apiDerived: List<Source>): List<Source> {
        val seen = apiDerived.map { it.screenName }.toSet()
        val baselineFiller = BaselineSources.asSources().filterNot { it.screenName in seen }
        return apiDerived + baselineFiller
    }

    override fun forSlug(slug: String): Flow<Result<SourceDetail>> = flow {
        val window = highlightsWindow()
        val first = window.firstOrNull { it.authorHandle == slug }
            ?: error("source not found: $slug")
        val matching = window.filter { it.authorHandle == slug }
        val detail = SourceDetail(
            source = Source(
                screenName = first.authorHandle,
                displayName = first.authorName,
                avatarUrl = first.authorAvatarUrl,
                firstSeenAt = matching.minOf { it.publishedAt.toLocalDateTime(TimeZone.UTC).date },
                highlightsCount = matching.size,
            ),
            recentHighlights = matching,
        )
        emit(Result.success(detail))
    }.catch { emit(Result.failure(it)) }

    private suspend fun deriveFromHighlightsWindow(): List<Source> {
        val window = highlightsWindow()
        val grouped = window.groupBy { it.authorHandle }
        return grouped.map { (handle, items) ->
            Source(
                screenName = handle,
                displayName = items.first().authorName,
                avatarUrl = items.first().authorAvatarUrl,
                firstSeenAt = items.minOf { it.publishedAt.toLocalDateTime(TimeZone.UTC).date },
                highlightsCount = items.size,
            )
        }.sortedByDescending { it.highlightsCount }
    }

    private suspend fun highlightsWindow(): List<org.revue_2_presse.domain.entities.Highlight> {
        val today = clock().toLocalDateTime(TimeZone.UTC).date
        val resp = api.highlights(today.minus(DatePeriod(days = 90)), today)
        return HydraToHighlight.map(resp)
    }
}
