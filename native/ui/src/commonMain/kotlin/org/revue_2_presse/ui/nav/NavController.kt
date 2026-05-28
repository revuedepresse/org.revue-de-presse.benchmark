package org.revue_2_presse.ui.nav

import androidx.compose.runtime.*

class RdpNavController(start: Any = HomeRoute) {
    private val _stack = mutableStateListOf<Any>(start)

    val current: Any get() = _stack.last()

    fun navigate(screen: Any) {
        _stack.add(screen)
    }

    fun popBackStack(): Boolean {
        if (_stack.size <= 1) return false
        _stack.removeAt(_stack.size - 1)
        return true
    }

    fun currentRoutePath(): String = when (val c = current) {
        is HomeRoute -> "/"
        is DayRoute -> "/${c.day}"
        is SourcesRoute -> "/sources"
        is SourceRoute -> "/source/${c.slug}"
        is LegalNoticeRoute -> "/mentions-legales"
        is TermsOfServiceRoute -> "/conditions-utilisation"
        is ContactRoute -> "/nous-contacter"
        is SupportRoute -> "/nous-soutenir"
        is NotFoundRoute -> "/contenu-introuvable"
        else -> "/contenu-introuvable"
    }
}

@Composable
fun rememberRdpNavController(start: Any = HomeRoute): RdpNavController =
    remember { RdpNavController(start) }
