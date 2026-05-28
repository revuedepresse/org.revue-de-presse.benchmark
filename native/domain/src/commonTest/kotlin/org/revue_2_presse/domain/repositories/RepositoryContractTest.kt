package org.revue_2_presse.domain.repositories

import kotlinx.coroutines.flow.Flow
import org.revue_2_presse.domain.entities.*
import kotlinx.datetime.LocalDate
import kotlin.reflect.KClass
import kotlin.test.Test
import kotlin.test.assertNotNull

class RepositoryContractTest {
    @Test fun all_interfaces_exposed_through_kotlin_reflection() {
        val expected: List<KClass<*>> = listOf(
            HighlightsRepository::class,
            SourcesRepository::class,
            DeviceTokenStore::class,
            InstallIdStore::class,
        )
        expected.forEach { assertNotNull(it.simpleName) }
    }
}
