package org.revue_2_presse.ios

import androidx.compose.material3.Scaffold
import androidx.compose.ui.window.ComposeUIViewController
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
import platform.UIKit.UIViewController

fun mainViewController(): UIViewController = ComposeUIViewController {
    KoinApplication(application = {
        modules(
            dataModule(
                baseUrl = "https://api.revue-de-presse.org",
                platform = "ios",
                appVersion = "1.0",
            ),
            installIdModule(),
            uiModule(),
        )
    }) {
        RdpTheme {
            Scaffold { _ ->
                val nav = rememberRdpNavController()
                val highlights = koinInject<HighlightsRepository>()
                val sources = koinInject<SourcesRepository>()
                RdpApp(nav.currentRoutePath(), onNavigate = {}) {
                    NavGraph(nav, highlights, sources)
                }
            }
        }
    }
}
