package org.revue_2_presse.domain.repositories

import org.revue_2_presse.domain.entities.DeviceToken

interface DeviceTokenStore {
    suspend fun current(): DeviceToken
    suspend fun invalidate()
}
