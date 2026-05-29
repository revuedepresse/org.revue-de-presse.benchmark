plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.kover)
}

kotlin {
    jvm()
    androidTarget {
        compilations.all { kotlinOptions.jvmTarget = "21" }
    }
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation(project(":domain"))
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.datetime)
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.ktor.client.logging)
            implementation(libs.koin.core)
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
            implementation(libs.kotlinx.coroutines.test)
            implementation(libs.turbine)
            implementation(libs.ktor.client.mock)
        }
        jvmMain.dependencies {
            // Ktor's CIO engine has a custom TLS stack that doesn't negotiate
            // TLS 1.3 — production nginx fronting local.api.revue-de-presse.org
            // rejected the handshake with a FATAL ProtocolVersion alert. Java
            // engine delegates to JDK java.net.http.HttpClient (TLS 1.3 native).
            implementation(libs.ktor.client.java)
        }
        androidMain.dependencies {
            // Android has no java.net.http (Java engine) and CIO's own TLS stack
            // can't negotiate TLS 1.3 with prod nginx; OkHttp uses the platform
            // TLS, which speaks TLS 1.3 on the API 34 target.
            implementation(libs.ktor.client.okhttp)
        }
        appleMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
    }
}

android {
    namespace = "org.revue_2_presse.data"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig { minSdk = libs.versions.android.minSdk.get().toInt() }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
}

kover {
    reports { verify { rule { minBound(85) } } }
}
