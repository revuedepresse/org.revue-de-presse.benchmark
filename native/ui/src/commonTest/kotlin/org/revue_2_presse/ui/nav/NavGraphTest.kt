package org.revue_2_presse.ui.nav

import androidx.compose.ui.test.*
import kotlinx.coroutines.flow.flowOf
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.entities.SourceDetail
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class NavGraphTest {
    private val highlightsRepo = object : HighlightsRepository {
        override fun forDay(day: LocalDate) = flowOf(Result.success(emptyList<Highlight>()))
        override fun forRange(start: LocalDate, end: LocalDate) = flowOf(Result.success(emptyList<Highlight>()))
        override suspend fun refresh(day: LocalDate) {}
    }
    private val sourcesRepo = object : SourcesRepository {
        override fun all() = flowOf(Result.success(emptyList<Source>()))
        override fun forSlug(slug: String) = flowOf(Result.failure<SourceDetail>(IllegalStateException()))
    }

    @Test fun starts_on_HomeScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController()
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("HomeScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_LegalNoticeRoute_shows_LegalNoticeScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = LegalNoticeRoute)
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("LegalNoticeScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_TermsOfServiceRoute_shows_TermsOfServiceScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = TermsOfServiceRoute)
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("TermsOfServiceScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_SupportRoute_shows_SupportScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = SupportRoute)
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("SupportScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_SourcesRoute_shows_SourcesScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = SourcesRoute)
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("SourcesScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_SourceRoute_shows_SourceScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = SourceRoute("le-monde"))
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("SourceScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_DayRoute_shows_DayScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = DayRoute("2026-05-27"))
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("DayScreen.root").assertIsDisplayed()
    }

    @Test fun navigate_to_NotFoundRoute_shows_NotFoundScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = NotFoundRoute)
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("NotFoundScreen.root").assertIsDisplayed()
    }

    @Test fun invalid_DayRoute_falls_back_to_NotFoundScreen() = runComposeUiTest {
        setContent {
            RdpTheme {
                val nav = rememberRdpNavController(start = DayRoute("not-a-date"))
                NavGraph(nav = nav, highlights = highlightsRepo, sources = sourcesRepo)
            }
        }
        onNodeWithTag("NotFoundScreen.root").assertIsDisplayed()
    }
}
