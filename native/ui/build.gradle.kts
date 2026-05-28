plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.kover)
}

kotlin {
    jvm()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation(project(":domain"))
            implementation(project(":design"))
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.components.resources)
            implementation(compose.materialIconsExtended)
            implementation(libs.androidx.compose.material3.adaptive)
            implementation(libs.coil.compose)
            implementation(libs.coil.network.ktor)
            // libs.androidx.navigation.compose deferred to Plan 06 Task 8:
            // navigation-compose:2.8.0-alpha10 does not exist on Maven Central / Google Maven
            implementation(libs.koin.compose)
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
            @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
            implementation(compose.uiTest)
        }
        jvmTest.dependencies {
            // Same fix as :design — Skiko native runtime for runComposeUiTest
            implementation(compose.desktop.currentOs)
        }
    }
}

kover { reports { verify { rule { minBound(75) } } } }
