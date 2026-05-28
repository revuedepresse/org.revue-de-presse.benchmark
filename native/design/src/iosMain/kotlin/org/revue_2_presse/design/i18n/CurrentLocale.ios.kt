package org.revue_2_presse.design.i18n

import org.revue_2_presse.domain.i18n.LocaleResolver
import org.revue_2_presse.domain.i18n.RdpLocale
import platform.Foundation.NSLocale
import platform.Foundation.currentLocale
import platform.Foundation.languageCode

actual fun currentRdpLocale(): RdpLocale =
    LocaleResolver.fromTag(NSLocale.currentLocale.languageCode ?: "en")
