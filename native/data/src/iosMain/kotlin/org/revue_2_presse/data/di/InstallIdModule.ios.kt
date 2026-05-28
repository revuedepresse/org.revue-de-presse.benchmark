package org.revue_2_presse.data.di

import org.koin.core.module.Module
import org.koin.dsl.module
import org.revue_2_presse.data.auth.InstallIdStoreImpl
import org.revue_2_presse.domain.repositories.InstallIdStore

actual fun installIdModule(): Module = module {
    single<InstallIdStore> { InstallIdStoreImpl() }
}
