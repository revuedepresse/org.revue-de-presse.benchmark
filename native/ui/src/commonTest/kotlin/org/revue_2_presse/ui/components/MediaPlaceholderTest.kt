package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class MediaPlaceholderTest {
    @Test fun renders_with_default_dimensions() = runComposeUiTest {
        setContent { RdpTheme { MediaPlaceholder() } }
        onNodeWithTag("MediaPlaceholder.root").assertIsDisplayed()
    }
}
