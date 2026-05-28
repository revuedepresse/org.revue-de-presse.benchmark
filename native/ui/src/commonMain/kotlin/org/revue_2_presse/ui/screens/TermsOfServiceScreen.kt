package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.ui.components.TermsOfServicePage

@Composable
fun TermsOfServiceScreen(modifier: Modifier = Modifier) =
    Box(modifier.testTag("TermsOfServiceScreen.root")) { TermsOfServicePage() }
