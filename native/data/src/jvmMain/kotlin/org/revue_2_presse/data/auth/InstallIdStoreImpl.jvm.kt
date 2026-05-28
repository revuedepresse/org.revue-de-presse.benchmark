package org.revue_2_presse.data.auth

import org.revue_2_presse.domain.repositories.InstallIdStore
import java.io.File

actual class InstallIdStoreImpl : InstallIdStore {
    private val file = File(System.getProperty("user.home"), ".revue-de-presse/install-id")

    override suspend fun current(): String {
        if (file.exists()) return file.readText().trim()
        return rotate()
    }

    override suspend fun rotate(): String {
        file.parentFile.mkdirs()
        val id = InstallIdGenerator.generate()
        file.writeText(id)
        return id
    }
}
