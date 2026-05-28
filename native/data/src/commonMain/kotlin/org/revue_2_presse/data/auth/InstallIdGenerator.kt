package org.revue_2_presse.data.auth

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.random.Random

object InstallIdGenerator {
    fun generate(now: Instant = Clock.System.now(), random: Random = Random.Default): String {
        val ms = now.toEpochMilliseconds() and 0xFFFFFFFFFFFFL  // 48 bits
        val randA = random.nextInt(0, 0x1000)                   // 12 bits
        val randB = random.nextLong() and 0x3FFFFFFFFFFFFFFFL    // 62 bits

        val bytes = ByteArray(16)
        for (i in 0 until 6) bytes[i] = (ms shr ((5 - i) * 8) and 0xFF).toByte()
        bytes[6] = (0x70 or (randA shr 8 and 0x0F)).toByte()
        bytes[7] = (randA and 0xFF).toByte()
        bytes[8] = (0x80 or (randB shr 56 and 0x3F).toInt()).toByte()
        for (i in 9 until 16) bytes[i] = (randB shr ((15 - i) * 8) and 0xFF).toByte()

        return buildString(36) {
            for (i in 0 until 16) {
                append(bytes[i].toUByte().toString(16).padStart(2, '0'))
                if (i == 3 || i == 5 || i == 7 || i == 9) append('-')
            }
        }
    }
}
