package org.revue_2_presse.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTagsAsResourceId
import org.koin.compose.koinInject
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.components.RdpApp
import org.revue_2_presse.ui.nav.NavGraph
import org.revue_2_presse.ui.nav.rememberRdpNavController

class MainActivity : ComponentActivity() {
    @OptIn(ExperimentalComposeUiApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RdpTheme {
                Scaffold(modifier = Modifier.semantics { testTagsAsResourceId = true }) { _ ->
                    val nav = rememberRdpNavController()
                    val highlights = koinInject<HighlightsRepository>()
                    val sources = koinInject<SourcesRepository>()
                    RdpApp(
                        currentRoute = nav.currentRoutePath(),
                        onNavigate = {},
                        modifier = Modifier.fillMaxSize(),
                    ) { NavGraph(nav = nav, highlights = highlights, sources = sources) }
                }
            }
        }
    }
}
