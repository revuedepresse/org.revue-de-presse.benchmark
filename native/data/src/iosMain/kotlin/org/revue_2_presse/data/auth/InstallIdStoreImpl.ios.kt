package org.revue_2_presse.data.auth

import kotlinx.cinterop.*
import org.revue_2_presse.domain.repositories.InstallIdStore
import platform.CoreFoundation.*
import platform.Foundation.*
import platform.Security.*

@OptIn(ExperimentalForeignApi::class)
actual class InstallIdStoreImpl : InstallIdStore {
    private val service = "org.revue-de-presse.app"
    private val account = "install-id"

    override suspend fun current(): String = readKeychain() ?: rotate()

    override suspend fun rotate(): String {
        val id = InstallIdGenerator.generate()
        writeKeychain(id)
        return id
    }

    private fun readKeychain(): String? = memScoped {
        val query = mutableMapOf<Any?, Any?>(
            kSecClass to kSecClassGenericPassword,
            kSecAttrService to service,
            kSecAttrAccount to account,
            kSecReturnData to kCFBooleanTrue,
            kSecMatchLimit to kSecMatchLimitOne,
        ) as NSDictionary
        val result = alloc<CFTypeRefVar>()
        val status = SecItemCopyMatching(query as CFDictionaryRef, result.ptr)
        if (status != errSecSuccess) return@memScoped null
        val data = result.value as? NSData ?: return@memScoped null
        NSString.create(data = data, encoding = NSUTF8StringEncoding) as String
    }

    private fun writeKeychain(value: String) = memScoped {
        SecItemDelete(NSDictionary.dictionaryWithObjects(
            arrayOf(kSecClassGenericPassword, service, account),
            arrayOf(kSecClass, kSecAttrService, kSecAttrAccount)
        ) as CFDictionaryRef)
        SecItemAdd(NSDictionary.dictionaryWithObjects(
            arrayOf(kSecClassGenericPassword, service, account,
                    (value as NSString).dataUsingEncoding(NSUTF8StringEncoding)!!),
            arrayOf(kSecClass, kSecAttrService, kSecAttrAccount, kSecValueData)
        ) as CFDictionaryRef, null)
    }
}
