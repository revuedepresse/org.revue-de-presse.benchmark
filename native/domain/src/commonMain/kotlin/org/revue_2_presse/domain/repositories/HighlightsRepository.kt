package org.revue_2_presse.domain.repositories

import kotlinx.coroutines.flow.Flow
import kotlinx.datetime.LocalDate
import org.revue_2_presse.domain.entities.Highlight

interface HighlightsRepository {
    fun forDay(day: LocalDate): Flow<Result<List<Highlight>>>
    fun forRange(start: LocalDate, end: LocalDate): Flow<Result<List<Highlight>>>
    suspend fun refresh(day: LocalDate)
}
