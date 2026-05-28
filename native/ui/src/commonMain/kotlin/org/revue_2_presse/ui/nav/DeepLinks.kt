package org.revue_2_presse.ui.nav

// androidx.navigation:navigation-compose is Android-only through 2.8.x and gained
// KMP metadata (common + jvmStubs) only in 2.9.0, but without iosArm64/iosSimulatorArm64
// klibs.  Since :ui targets JVM + all three iOS slices in commonMain, the full
// navDeepLink { } DSL cannot be used here.
//
// Plain URI-pattern strings are kept instead.  T12 (NavHost assembly) will wire
// these into NavDeepLink objects on the Android side once the module grows an
// androidMain source set (or the project adds an :androidUi split).
object DeepLinks {
    private const val WEB = "https://revue-de-presse.org"
    val home = "$WEB/"
    val sources = "$WEB/sources"
    val sourceTemplate = "$WEB/source/{slug}"
    val legalNotice = "$WEB/mentions-legales"
    val termsOfService = "$WEB/conditions-utilisation"
    val contact = "$WEB/nous-contacter"
    val support = "$WEB/nous-soutenir"
    val notFound = "$WEB/contenu-introuvable"
    val dayTemplate = "$WEB/{day}"
}
