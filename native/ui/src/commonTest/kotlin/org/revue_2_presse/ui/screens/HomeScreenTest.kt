package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import kotlinx.coroutines.flow.flowOf
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.repositories.HighlightsRepository
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class HomeScreenTest {
    @Test fun renders_root() = runComposeUiTest {
        val fakeRepo = object : HighlightsRepository {
            override fun forDay(day: LocalDate) = flowOf(Result.success(emptyList<Highlight>()))
            override fun forRange(start: LocalDate, end: LocalDate) = flowOf(Result.success(emptyList<Highlight>()))
            override suspend fun refresh(day: LocalDate) {}
        }
        setContent { RdpTheme { HomeScreen(repo = fakeRepo, onNavigate = {}) } }
        onNodeWithTag("HomeScreen.root").assertIsDisplayed()
    }
}
