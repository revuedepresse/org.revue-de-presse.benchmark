package org.revue_2_presse.data.api

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class HydraTypesTest {

    @Test fun device_token_request_holds_fields() {
        val req = DeviceTokenRequest("android", "1.2.3", "install-id-xyz")
        assertEquals("android", req.platform)
        assertEquals("1.2.3", req.appVersion)
        assertEquals("install-id-xyz", req.installId)
    }

    @Test fun hydra_device_token_holds_fields() {
        val tok = HydraDeviceToken(token = "abc123", expiresInSec = 3600)
        assertEquals("abc123", tok.token)
        assertEquals(3600, tok.expiresInSec)
        assertEquals(emptyList(), tok.scopes)
    }

    @Test fun hydra_source_holds_fields() {
        val src = HydraSource(
            id = "/api/sources/1",
            screenName = "lemonde.fr",
            displayName = "Le Monde",
            avatarUrl = "https://cdn.example.com/lemonde.jpg",
            firstSeenAt = "2024-01-01",
            highlightsCount = 42,
        )
        assertEquals("lemonde.fr", src.screenName)
        assertEquals("Le Monde", src.displayName)
        assertEquals(42, src.highlightsCount)
    }

    @Test fun hydra_error_holds_fields() {
        val err = HydraError(title = "Not Found", description = "Resource not found", status = 404)
        assertEquals("Not Found", err.title)
        assertEquals(404, err.status)
        assertEquals("Resource not found", err.description)
    }

    @Test fun api_endpoints_sources_and_source() {
        val ep = ApiEndpoints("https://api.example.test")
        assertEquals("https://api.example.test/api/sources", ep.sources())
        assertEquals("https://api.example.test/api/sources/lemonde.fr", ep.source("lemonde.fr"))
    }
}
