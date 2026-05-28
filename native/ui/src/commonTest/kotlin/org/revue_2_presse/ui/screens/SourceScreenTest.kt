package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import kotlinx.coroutines.flow.flowOf
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.entities.SourceDetail
import org.revue_2_presse.domain.repositories.SourcesRepository
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SourceScreenTest {
    @Test fun renders_root() = runComposeUiTest {
        val repo = object : SourcesRepository {
            override fun all() = flowOf(Result.success(emptyList<Source>()))
            override fun forSlug(slug: String) = flowOf(
                Result.success(
                    SourceDetail(
                        source = Source(
                            screenName = slug,
                            displayName = "Test",
                            avatarUrl = null,
                            firstSeenAt = kotlinx.datetime.LocalDate(2024, 1, 1),
                            highlightsCount = 0,
                        ),
                        recentHighlights = emptyList(),
                    )
                )
            )
        }
        setContent { RdpTheme { SourceScreen(slug = "test-source", repo = repo) } }
        onNodeWithTag("SourceScreen.root").assertIsDisplayed()
    }
}
