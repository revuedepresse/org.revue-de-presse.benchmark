package org.revue_2_presse.domain.i18n

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class RdpStringsTest {
    @Test fun returns_fr_for_FR_FR_locale() {
        val s = RdpStrings.get(RdpLocale.FR_FR, RdpStrings.Key.ActionsQuitLabel)
        assertEquals("Quitter", s)
    }
    @Test fun returns_en_for_EN_GB_locale() {
        val s = RdpStrings.get(RdpLocale.EN_GB, RdpStrings.Key.ActionsQuitLabel)
        assertTrue(s.isNotBlank())
        assertTrue(s != "Quitter", "expected an English translation, got '$s'")
    }
    @Test fun interpolates_named_args() {
        val s = RdpStrings.get(
            RdpLocale.FR_FR,
            RdpStrings.Key.ErrorsPasswordTooShort,
            "min" to 12,
        )
        assertTrue(s.contains("12"), "expected '12' in '$s'")
    }
}
