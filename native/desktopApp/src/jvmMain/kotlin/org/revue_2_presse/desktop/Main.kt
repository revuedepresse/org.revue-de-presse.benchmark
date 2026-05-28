package org.revue_2_presse.desktop

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPlacement
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import org.koin.compose.KoinApplication
import org.koin.compose.koinInject
import org.revue_2_presse.data.di.dataModule
import org.revue_2_presse.data.di.installIdModule
import org.revue_2_presse.design.drawables.rdpLogoPainter
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.components.LocalOpenExternalUrl
import org.revue_2_presse.ui.components.RdpApp
import org.revue_2_presse.ui.di.uiModule
import org.revue_2_presse.ui.nav.NavGraph
import org.revue_2_presse.ui.nav.rememberRdpNavController
import androidx.compose.runtime.CompositionLocalProvider
import java.awt.Desktop
import java.net.URI

fun main() {
    installRevueDePresseDockIcon()
    application {
        runApp()
    }
}

@androidx.compose.runtime.Composable
private fun androidx.compose.ui.window.ApplicationScope.runApp() {
    val windowState = rememberWindowState(placement = WindowPlacement.Maximized)
    Window(
        onCloseRequest = ::exitApplication,
        state = windowState,
        title = "Revue de presse",
        icon = rdpLogoPainter(),
    ) {
        KoinApplication(application = {
            modules(
                dataModule(
                    baseUrl = "https://local.api.revue-de-presse.org",
                    platform = "desktop",
                    appVersion = "22",
                ),
                installIdModule(),
                uiModule(),
            )
        }) {
            CompositionLocalProvider(
                LocalOpenExternalUrl provides { url ->
                    runCatching {
                        if (Desktop.isDesktopSupported() &&
                            Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                            Desktop.getDesktop().browse(URI(url))
                        }
                    }
                },
            ) {
            RdpTheme(locale = RdpLocale.FR_FR) {
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
}
