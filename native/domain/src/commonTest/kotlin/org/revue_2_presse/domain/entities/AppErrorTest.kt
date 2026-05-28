package org.revue_2_presse.domain.entities

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

class AppErrorTest {
    @Test fun offline_has_no_payload() {
        val e: AppError = AppError.Offline
        assertIs<AppError.Offline>(e)
    }

    @Test fun upstream_failure_carries_status() {
        val e: AppError = AppError.UpstreamFailure(503)
        assertIs<AppError.UpstreamFailure>(e)
        assertEquals(503, e.status)
    }

    @Test fun from_maps_known_kinds() {
        assertIs<AppError.Timeout>(AppError.from(IOTimeout))
        assertIs<AppError.Offline>(AppError.from(IONoNetwork))
    }
}

private object IOTimeout : Throwable("timeout")
private object IONoNetwork : Throwable("unreachable") {
    private fun readResolve(): Any = IONoNetwork
}
