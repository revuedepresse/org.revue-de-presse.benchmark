package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp

@Composable
fun RdpApp(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    // Simplified shell: always desktop layout for now (sidebar on left).
    // Compose Multiplatform's currentWindowAdaptiveInfo() availability across CMP 1.7.1
    // varies; use a simple Row layout that works on all platforms.
    Box(modifier.testTag("App.root").fillMaxSize()) {
        Row(Modifier.fillMaxSize().widthIn(max = 952.dp)) {
            Sidebar(currentRoute = currentRoute, onNavigate = onNavigate)
            Box(Modifier.fillMaxSize()) { content() }
        }
    }
}
