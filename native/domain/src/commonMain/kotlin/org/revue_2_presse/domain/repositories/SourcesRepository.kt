package org.revue_2_presse.domain.repositories

import kotlinx.coroutines.flow.Flow
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.entities.SourceDetail

interface SourcesRepository {
    fun all(): Flow<Result<List<Source>>>
    fun forSlug(slug: String): Flow<Result<SourceDetail>>
}
