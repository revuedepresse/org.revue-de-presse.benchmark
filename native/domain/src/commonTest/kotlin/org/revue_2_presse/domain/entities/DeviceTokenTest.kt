package org.revue_2_presse.domain.entities

import kotlinx.datetime.Instant
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class DeviceTokenTest {
    @Test fun expired_when_now_after_expiresAt() {
        val t = DeviceToken("abc", expiresAt = Instant.parse("2026-01-01T00:00:00Z"))
        assertTrue(t.isExpiredAt(Instant.parse("2026-01-01T00:00:01Z")))
        assertFalse(t.isExpiredAt(Instant.parse("2025-12-31T23:59:59Z")))
    }

    @Test fun expiring_soon_uses_30s_safety_margin() {
        val t = DeviceToken("abc", expiresAt = Instant.parse("2026-01-01T00:00:30Z"))
        val now = Instant.parse("2026-01-01T00:00:01Z")
        assertTrue(t.isExpiringSoonAt(now))
    }
}
