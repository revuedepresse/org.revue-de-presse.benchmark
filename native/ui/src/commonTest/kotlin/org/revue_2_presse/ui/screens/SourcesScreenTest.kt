package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import kotlinx.coroutines.flow.flowOf
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.entities.SourceDetail
import org.revue_2_presse.domain.repositories.SourcesRepository
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SourcesScreenTest {
    @Test fun renders_root() = runComposeUiTest {
        val repo = object : SourcesRepository {
            override fun all() = flowOf(Result.success(emptyList<Source>()))
            override fun forSlug(slug: String) = flowOf(Result.failure<SourceDetail>(IllegalStateException("not used")))
        }
        setContent { RdpTheme { SourcesScreen(repo = repo, onSourceClick = {}) } }
        onNodeWithTag("SourcesScreen.root").assertIsDisplayed()
    }
}
