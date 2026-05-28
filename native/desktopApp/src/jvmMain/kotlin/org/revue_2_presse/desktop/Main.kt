package org.revue_2_presse.desktop

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpStrings

fun main() = application {
    val windowState = rememberWindowState(size = DpSize(960.dp, 720.dp))
    Window(onCloseRequest = ::exitApplication, state = windowState, title = "Revue de presse — desktop preview") {
        App()
    }
}

@Composable
fun App() {
    RdpTheme {
        Scaffold { padding ->
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text(rdpString(RdpStrings.Key.LogoAlt))
            }
        }
    }
}
