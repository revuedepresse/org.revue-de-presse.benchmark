package org.revue_2_presse.design.i18n

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import org.revue_2_presse.design.theme.LocalRdpLocale
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
@ReadOnlyComposable
fun rdpString(key: RdpStrings.Key, vararg args: Pair<String, Any>): String {
    val locale = LocalRdpLocale.current
    return RdpStrings.get(locale, key, *args)
}
