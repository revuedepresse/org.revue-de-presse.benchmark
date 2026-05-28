package org.revue_2_presse.ui.components

import androidx.compose.runtime.compositionLocalOf

// Platform-specific URL opener provided by the entry point (Desktop / Android /
// iOS). Default is a no-op so previews + tests don't crash; production entry
// points supply a real implementation (e.g. java.awt.Desktop.getDesktop().browse).
val LocalOpenExternalUrl = compositionLocalOf<(String) -> Unit> { { /* no-op */ } }
