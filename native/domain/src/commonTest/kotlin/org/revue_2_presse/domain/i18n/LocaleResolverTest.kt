package org.revue_2_presse.domain.i18n

import kotlin.test.Test
import kotlin.test.assertEquals

class LocaleResolverTest {
    @Test fun fr_FR_tag_maps_to_FR_FR() {
        assertEquals(RdpLocale.FR_FR, LocaleResolver.fromTag("fr-FR"))
    }
    @Test fun fr_anything_maps_to_FR_FR() {
        assertEquals(RdpLocale.FR_FR, LocaleResolver.fromTag("fr-CA"))
        assertEquals(RdpLocale.FR_FR, LocaleResolver.fromTag("fr"))
    }
    @Test fun anything_else_maps_to_EN_GB() {
        assertEquals(RdpLocale.EN_GB, LocaleResolver.fromTag("en-US"))
        assertEquals(RdpLocale.EN_GB, LocaleResolver.fromTag("de-DE"))
        assertEquals(RdpLocale.EN_GB, LocaleResolver.fromTag(""))
        assertEquals(RdpLocale.EN_GB, LocaleResolver.fromTag("invalid"))
    }
}
