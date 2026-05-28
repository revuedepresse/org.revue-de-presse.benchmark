package org.revue_2_presse.data.auth

import kotlinx.datetime.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class InstallIdGeneratorTest {
    @Test fun shape_is_uuid_v7() {
        val id = InstallIdGenerator.generate(now = Instant.parse("2026-05-28T12:00:00Z"))
        val parts = id.split("-")
        assertEquals(5, parts.size)
        assertEquals(8, parts[0].length)
        assertEquals(4, parts[1].length)
        assertEquals(4, parts[2].length)
        assertEquals(4, parts[3].length)
        assertEquals(12, parts[4].length)
        assertEquals('7', parts[2].first(), "version nibble must be 7")
        assertTrue(parts[3].first() in "89ab", "variant nibble must be 8/9/a/b")
    }

    @Test fun distinct_at_same_instant() {
        val now = Instant.parse("2026-05-28T12:00:00Z")
        val a = InstallIdGenerator.generate(now = now)
        val b = InstallIdGenerator.generate(now = now)
        assertNotEquals(a, b)
    }

    @Test fun sortable_by_timestamp() {
        val early = InstallIdGenerator.generate(now = Instant.parse("2026-01-01T00:00:00Z"))
        val late = InstallIdGenerator.generate(now = Instant.parse("2026-12-31T23:59:59Z"))
        assertTrue(early < late, "UUID v7 must be lexicographically sortable by time")
    }
}
