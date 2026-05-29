package org.revue_2_presse.data.repositories

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import kotlinx.datetime.LocalDate
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.mappers.HydraToHighlight
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.repositories.HighlightsRepository

class HighlightsRepositoryImpl(private val api: ApiClient) : HighlightsRepository {

    private val cache = mutableMapOf<LocalDate, List<Highlight>>()

    override fun forDay(day: LocalDate): Flow<Result<List<Highlight>>> = flow {
        // Emit cached data only when we actually have it. Emitting an empty list
        // for an uncached day would flip the UI to a "loaded, zero items" state
        // and hide the loading spinner while the network call is still in flight.
        cache[day]?.let { emit(Result.success(it)) }
        val resp = api.highlights(day, day)
        val mapped = HydraToHighlight.map(resp)
        cache[day] = mapped
        emit(Result.success(mapped))
    }.catch { emit(Result.failure(it)) }

    override fun forRange(start: LocalDate, end: LocalDate): Flow<Result<List<Highlight>>> = flow {
        val resp = api.highlights(start, end)
        emit(Result.success(HydraToHighlight.map(resp)))
    }.catch { emit(Result.failure(it)) }

    override suspend fun refresh(day: LocalDate) {
        val resp = api.highlights(day, day)
        cache[day] = HydraToHighlight.map(resp)
    }
}
