package org.revue_2_presse.domain.entities

import kotlinx.datetime.Instant
import kotlin.time.Duration.Companion.seconds

data class DeviceToken(val raw: String, val expiresAt: Instant) {
    fun isExpiredAt(now: Instant): Boolean = now >= expiresAt
    fun isExpiringSoonAt(now: Instant): Boolean = (expiresAt - now) <= 30.seconds
}
