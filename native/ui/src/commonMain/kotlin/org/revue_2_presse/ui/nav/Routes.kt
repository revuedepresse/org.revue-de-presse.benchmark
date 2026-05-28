package org.revue_2_presse.ui.nav

import kotlinx.serialization.Serializable

@Serializable data object HomeRoute
@Serializable data class DayRoute(val day: String)
@Serializable data object SourcesRoute
@Serializable data class SourceRoute(val slug: String)
@Serializable data object LegalNoticeRoute
@Serializable data object TermsOfServiceRoute
@Serializable data object SupportRoute
@Serializable data object NotFoundRoute
