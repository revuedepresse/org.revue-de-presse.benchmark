package org.revue_2_presse.domain.repositories

interface InstallIdStore {
    suspend fun current(): String        // UUID v7
    suspend fun rotate(): String         // generate + persist new id, return it
}
