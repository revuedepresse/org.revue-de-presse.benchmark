package org.revue_2_presse.desktop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.entities.Metrics
import org.revue_2_presse.ui.components.Alert
import org.revue_2_presse.ui.components.AlertVariant
import org.revue_2_presse.ui.components.AppHeader
import org.revue_2_presse.ui.components.AuthCard
import org.revue_2_presse.ui.components.BannerAbout
import org.revue_2_presse.ui.components.BlueskyPostCard
import org.revue_2_presse.ui.components.Calendar
import org.revue_2_presse.ui.components.EmailField
import org.revue_2_presse.ui.components.FieldError
import org.revue_2_presse.ui.components.FormError
import org.revue_2_presse.ui.components.IntroCard
import org.revue_2_presse.ui.components.Logo
import org.revue_2_presse.ui.components.MediaPlaceholder
import org.revue_2_presse.ui.components.MetricsBar
import org.revue_2_presse.ui.components.MonthPicker
import org.revue_2_presse.ui.components.Notice
import org.revue_2_presse.ui.components.PasswordField
import org.revue_2_presse.ui.components.RdpButton
import org.revue_2_presse.ui.components.RdpCheckbox
import org.revue_2_presse.ui.components.RdpIcon
import org.revue_2_presse.ui.components.RdpLink
import org.revue_2_presse.ui.components.RdpTextField
import org.revue_2_presse.ui.components.SnapshotsList
import org.revue_2_presse.ui.components.SnapshotsState
import org.revue_2_presse.ui.components.Spinner
import org.revue_2_presse.ui.components.WebIntents
import org.revue_2_presse.ui.components.YearPicker

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
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text("Component gallery — Plan 04")

                // Primitives
                Alert(variant = AlertVariant.Info) { Text("info") }
                Alert(variant = AlertVariant.Warning) { Text("warning") }
                RdpButton(onClick = {}) { Text("Continuer") }
                RdpCheckbox(checked = true, onCheckedChange = {}, label = { Text("Accept") })
                RdpIcon(name = "menu")
                RdpLink(href = "https://x", onClick = {}) { Text("link") }
                Logo()
                MediaPlaceholder()
                Notice { Text("nothing yet") }
                Spinner()

                // Forms
                RdpTextField(value = "", onValueChange = {}, label = "Texte")
                EmailField(value = "", onValueChange = {})
                PasswordField(value = "", onValueChange = {})
                FieldError(message = "Too short")
                FormError(message = "Bad creds")
                AuthCard(
                    title = "Connexion",
                    email = "", onEmailChange = {},
                    password = "", onPasswordChange = {},
                    onSubmit = {},
                    submitLabel = "Continuer",
                )

                Text("---")
                Text("Plan 05 components:")

                // Calendar group
                Calendar(initial = LocalDate(2026, 5, 28), onSelect = {})
                MonthPicker(selected = 5, onSelect = {})
                YearPicker(selected = 2026, range = 2020..2026, onSelect = {})

                // Highlights / cards
                AppHeader(title = { Text("Revue de presse") }, right = { Text("FR") })
                MetricsBar(metrics = Metrics(replies = 12, reposts = 80, likes = 127))
                val fixturePost = Highlight(
                    id = "1",
                    authorName = "France Culture",
                    authorHandle = "franceculture.fr",
                    authorAvatarUrl = null,
                    body = "Exemple de publication.",
                    publishedAt = Instant.parse("2026-05-01T04:00:00Z"),
                    metrics = Metrics(12, 80, 127),
                    url = "https://x",
                )
                BlueskyPostCard(post = fixturePost)
                SnapshotsList(
                    state = SnapshotsState.Loaded(
                        items = listOf(
                            fixturePost,
                            fixturePost.copy(id = "2"),
                            fixturePost.copy(id = "3"),
                        ),
                    ),
                )
                IntroCard(title = { Text("Bienvenue") }, body = { Text("Une démo.") })
                BannerAbout(onClick = {})
                WebIntents(url = "https://bsky.app/x", onOpen = {}, onShare = {})
            }
        }
    }
}
