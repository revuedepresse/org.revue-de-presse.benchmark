package org.revue_2_presse.ui.nav

import androidx.compose.runtime.Composable
import kotlinx.datetime.LocalDate
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.screens.*

@Composable
fun NavGraph(
    nav: RdpNavController,
    highlights: HighlightsRepository,
    sources: SourcesRepository,
) {
    when (val screen = nav.current) {
        is HomeRoute -> HomeScreen(repo = highlights, onNavigate = { path ->
            navigateToPath(nav, path)
        })
        is DayRoute -> {
            val parsed = runCatching { LocalDate.parse(screen.day) }.getOrNull()
            if (parsed == null) NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
            else DayScreen(day = parsed, repo = highlights)
        }
        is SourcesRoute -> SourcesScreen(
            repo = sources,
            onSourceClick = { slug -> nav.navigate(SourceRoute(slug)) },
        )
        is SourceRoute -> SourceScreen(slug = screen.slug, repo = sources)
        is LegalNoticeRoute -> LegalNoticeScreen()
        is TermsOfServiceRoute -> TermsOfServiceScreen()
        is ContactRoute -> ContactScreen(onSubmit = { _, _, _ -> })
        is SupportRoute -> SupportScreen(onDonateClick = {})
        is NotFoundRoute -> NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
        else -> NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
    }
}

private fun navigateToPath(nav: RdpNavController, path: String) {
    when (path) {
        "/" -> nav.navigate(HomeRoute)
        "/sources" -> nav.navigate(SourcesRoute)
        "/mentions-legales" -> nav.navigate(LegalNoticeRoute)
        "/conditions-utilisation" -> nav.navigate(TermsOfServiceRoute)
        "/nous-contacter" -> nav.navigate(ContactRoute)
        "/nous-soutenir" -> nav.navigate(SupportRoute)
        "/contenu-introuvable" -> nav.navigate(NotFoundRoute)
        else -> {
            if (path.startsWith("/source/")) {
                nav.navigate(SourceRoute(path.removePrefix("/source/")))
            } else if (path.startsWith("/")) {
                val candidate = path.removePrefix("/")
                if (runCatching { LocalDate.parse(candidate) }.isSuccess) {
                    nav.navigate(DayRoute(candidate))
                } else {
                    nav.navigate(NotFoundRoute)
                }
            }
        }
    }
}
