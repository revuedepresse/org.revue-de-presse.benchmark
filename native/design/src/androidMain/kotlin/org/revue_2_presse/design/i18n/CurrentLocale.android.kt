package org.revue_2_presse.design.i18n

import org.revue_2_presse.domain.i18n.LocaleResolver
import org.revue_2_presse.domain.i18n.RdpLocale
import java.util.Locale

actual fun currentRdpLocale(): RdpLocale = LocaleResolver.fromTag(Locale.getDefault().toLanguageTag())
