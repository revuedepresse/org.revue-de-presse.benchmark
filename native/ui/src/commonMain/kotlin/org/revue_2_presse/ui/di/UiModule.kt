package org.revue_2_presse.ui.di

import org.koin.core.module.Module
import org.koin.dsl.module

fun uiModule(): Module = module {
    // No bindings yet — screens consume repositories from :data's module directly.
    // This module exists so apps can register additional UI-layer singletons later.
}
