package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.ui.components.ContactPage

@Composable
fun ContactScreen(
    onSubmit: (email: String, subject: String, message: String) -> Unit,
    modifier: Modifier = Modifier,
) = Box(modifier.testTag("ContactScreen.root")) { ContactPage(onSubmit = onSubmit) }
