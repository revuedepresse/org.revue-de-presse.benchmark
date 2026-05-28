package org.revue_2_presse.data.auth

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import org.revue_2_presse.data.api.ApiClient
import org.revue_2_presse.data.api.DeviceTokenRequest
import org.revue_2_presse.domain.entities.DeviceToken
import org.revue_2_presse.domain.repositories.DeviceTokenStore
import org.revue_2_presse.domain.repositories.InstallIdStore
import kotlin.time.Duration.Companion.seconds

class DeviceTokenStoreImpl(
    private val api: ApiClient,
    private val installIds: InstallIdStore,
    private val platform: String,
    private val appVersion: String,
    private val clock: () -> Instant = { Clock.System.now() },
) : DeviceTokenStore {

    private val mutex = Mutex()
    private var cached: DeviceToken? = null

    override suspend fun current(): DeviceToken = mutex.withLock {
        val now = clock()
        cached?.takeIf { !it.isExpiringSoonAt(now) }?.let { return it }
        mint(now).also { cached = it }
    }

    override suspend fun invalidate() = mutex.withLock {
        cached = null
    }

    private suspend fun mint(now: Instant): DeviceToken {
        val req = DeviceTokenRequest(platform, appVersion, installIds.current())
        val resp = runCatching { api.mintDeviceToken(req) }.getOrElse { throwable ->
            // 403 on this install id → rotate and retry once
            installIds.rotate()
            api.mintDeviceToken(DeviceTokenRequest(platform, appVersion, installIds.current()))
        }
        return DeviceToken(raw = resp.token, expiresAt = now + resp.expiresInSec.seconds)
    }
}
