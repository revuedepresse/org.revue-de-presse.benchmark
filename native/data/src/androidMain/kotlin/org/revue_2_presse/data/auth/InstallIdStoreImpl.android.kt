package org.revue_2_presse.data.auth

import org.revue_2_presse.domain.repositories.InstallIdStore
import java.io.File

actual class InstallIdStoreImpl : InstallIdStore {
    // java.io.tmpdir resolves to the app-private cache dir on Android (writable
    // without a Context); on the JVM it is the system temp dir. Mirrors the
    // file-backed JVM store so the install id survives within the app sandbox.
    private val file = File(System.getProperty("java.io.tmpdir"), "revue-de-presse-install-id")

    override suspend fun current(): String {
        if (file.exists()) return file.readText().trim()
        return rotate()
    }

    override suspend fun rotate(): String {
        file.parentFile?.mkdirs()
        val id = InstallIdGenerator.generate()
        file.writeText(id)
        return id
    }
}
