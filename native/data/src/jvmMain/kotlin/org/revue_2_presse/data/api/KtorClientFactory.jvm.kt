package org.revue_2_presse.data.api

import io.ktor.client.HttpClient
import io.ktor.client.HttpClientConfig
import io.ktor.client.engine.java.Java
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import java.io.File
import java.security.KeyStore
import java.security.SecureRandom
import java.security.cert.CertificateFactory
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager

actual class KtorClientFactory {
    actual fun create(extraConfig: HttpClientConfig<*>.() -> Unit): HttpClient =
        HttpClient(Java) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true; encodeDefaults = false })
            }
            install(Logging) { level = io.ktor.client.plugins.logging.LogLevel.INFO }
            engine {
                config {
                    sslContext(buildSslContextIncludingMkcert())
                }
            }
            extraConfig()
        }
}

// Dev TLS trust: on a macOS dev box the API at https://local.api.revue-de-presse.org
// is signed by the locally-installed mkcert root CA. The macOS Keychain trusts it
// (curl/Chrome work) but the JVM truststore does not. The Java engine accepts a
// custom SSLContext; we build one that combines the default system trust roots
// with the mkcert root when its file is present. Production targets are signed
// by a real CA so the mkcert lookup falls through silently and behaviour is
// unchanged.
private fun buildSslContextIncludingMkcert(): SSLContext {
    val systemTm = defaultTrustManager()
    val mkcertRoot = mkcertRootFile()
    val finalTm = if (mkcertRoot == null) {
        systemTm
    } else {
        runCatching {
            val keyStore = KeyStore.getInstance(KeyStore.getDefaultType()).apply {
                load(null, null)
                systemTm.acceptedIssuers.forEachIndexed { index, cert ->
                    setCertificateEntry("system-$index", cert)
                }
                val factory = CertificateFactory.getInstance("X.509")
                mkcertRoot.inputStream().use { input ->
                    setCertificateEntry("mkcert-root", factory.generateCertificate(input))
                }
            }
            val tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
            tmf.init(keyStore)
            tmf.trustManagers.filterIsInstance<X509TrustManager>().first()
        }.getOrDefault(systemTm)
    }

    return SSLContext.getInstance("TLS").apply {
        init(null, arrayOf(finalTm), SecureRandom())
    }
}

private fun mkcertRootFile(): File? {
    val candidates = sequenceOf(
        System.getenv("CAROOT"),
        System.getProperty("user.home") + "/Library/Application Support/mkcert", // macOS
        System.getProperty("user.home") + "/.local/share/mkcert",                 // Linux
        System.getenv("LOCALAPPDATA")?.plus("\\mkcert"),                          // Windows
    )
    return candidates.filterNotNull()
        .map { File(it, "rootCA.pem") }
        .firstOrNull { it.isFile && it.canRead() }
}

private fun defaultTrustManager(): X509TrustManager {
    val tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
    tmf.init(null as KeyStore?)
    return tmf.trustManagers.filterIsInstance<X509TrustManager>().first()
}
