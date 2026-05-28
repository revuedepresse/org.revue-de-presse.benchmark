package org.revue_2_presse.android

import android.app.Application
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import org.revue_2_presse.BuildConfig
import org.revue_2_presse.data.di.dataModule
import org.revue_2_presse.data.di.installIdModule
import org.revue_2_presse.ui.di.uiModule

class RdpApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@RdpApplication)
            modules(
                dataModule(
                    baseUrl = if (BuildConfig.DEBUG) "https://api.dev.revue-de-presse.org"
                              else "https://api.revue-de-presse.org",
                    platform = "android",
                    appVersion = BuildConfig.VERSION_NAME,
                ),
                installIdModule(),
                uiModule(),
            )
        }
    }
}
