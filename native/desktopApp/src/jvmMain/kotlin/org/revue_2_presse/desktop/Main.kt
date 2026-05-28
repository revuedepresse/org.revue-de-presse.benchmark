package org.revue_2_presse.desktop

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import org.koin.compose.KoinApplication
import org.koin.compose.koinInject
import org.revue_2_presse.data.di.dataModule
import org.revue_2_presse.data.di.installIdModule
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.components.RdpApp
import org.revue_2_presse.ui.di.uiModule
import org.revue_2_presse.ui.nav.NavGraph
import org.revue_2_presse.ui.nav.rememberRdpNavController

fun main() = application {
    val windowState = rememberWindowState(size = DpSize(1280.dp, 800.dp))
    Window(onCloseRequest = ::exitApplication, state = windowState, title = "Revue de presse") {
        KoinApplication(application = {
            modules(
                dataModule(
                    baseUrl = "https://api.dev.revue-de-presse.org",
                    platform = "desktop",
                    appVersion = "22",
                ),
                installIdModule(),
                uiModule(),
            )
        }) {
            RdpTheme {
                Scaffold { padding ->
                    Box(Modifier.padding(padding)) {
                        val nav = rememberRdpNavController()
                        val highlights = koinInject<HighlightsRepository>()
                        val sources = koinInject<SourcesRepository>()

                        RdpApp(
                            currentRoute = nav.currentRoutePath(),
                            onNavigate = { path -> nav.navigateToPath(path) },
                            modifier = Modifier.fillMaxSize(),
                        ) {
                            NavGraph(nav = nav, highlights = highlights, sources = sources)
                        }
                    }
                }
            }
        }
    }
}
