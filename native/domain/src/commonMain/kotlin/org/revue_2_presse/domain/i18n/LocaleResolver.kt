package org.revue_2_presse.domain.i18n

object LocaleResolver {
    fun fromTag(tag: String): RdpLocale =
        if (tag.lowercase().startsWith("fr")) RdpLocale.FR_FR else RdpLocale.EN_GB
}
