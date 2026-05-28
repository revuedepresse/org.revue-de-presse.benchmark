package org.revue_2_presse.data.di

import io.ktor.client.HttpClient
import org.koin.dsl.module
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.api.ApiEndpoints
import org.revue_2_presse.data.api.KtorClientFactory
import org.revue_2_presse.data.auth.DeviceTokenInterceptor
import org.revue_2_presse.data.auth.DeviceTokenStoreImpl
import org.revue_2_presse.data.repositories.HighlightsRepositoryImpl
import org.revue_2_presse.data.repositories.SourcesRepositoryImpl
import org.revue_2_presse.domain.repositories.DeviceTokenStore
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository

fun dataModule(baseUrl: String, platform: String, appVersion: String) = module {
    single { KtorClientFactory() }
    single { ApiEndpoints(baseUrl) }
    single<HttpClient> {
        get<KtorClientFactory>().create {
            install(DeviceTokenInterceptor) {
                tokenStoreProvider = { get() }
                this.baseUrl = baseUrl
            }
        }
    }
    single { ApiClient(http = get(), endpoints = get()) }
    single<DeviceTokenStore> {
        DeviceTokenStoreImpl(api = get(), installIds = get(), platform = platform, appVersion = appVersion)
    }
    single<HighlightsRepository> { HighlightsRepositoryImpl(api = get()) }
    single<SourcesRepository> { SourcesRepositoryImpl(api = get()) }
}
