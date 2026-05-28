package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Source
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class SourcesPageTest {
    @Test fun renders_each_source_and_emits_slug_on_click() = runComposeUiTest {
        var clicked: String? = null
        val sources = listOf(
            Source("franceculture.fr", "France Culture", null, LocalDate(2022, 1, 14), 1247),
            Source("lemonde.fr", "Le Monde", null, LocalDate(2022, 1, 14), 999),
        )
        setContent { RdpTheme { SourcesPage(sources = sources, onSourceClick = { clicked = it }) } }
        onNodeWithTag("SourcesPage.row.franceculture.fr").assertIsDisplayed()
        onNodeWithTag("SourcesPage.row.lemonde.fr").performClick()
        assertEquals("lemonde.fr", clicked)
    }
}
