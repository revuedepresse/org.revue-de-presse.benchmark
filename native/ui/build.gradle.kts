plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.kotlinSerialization)
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
            implementation(libs.kotlinx.datetime)
            implementation(libs.kotlinx.serialization.json)
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.components.resources)
            implementation(compose.materialIconsExtended)
            implementation(libs.androidx.compose.material3.adaptive)
            implementation(libs.coil.compose)
            implementation(libs.coil.network.ktor)
            // navigation-compose (libs.androidx.navigation.compose) is intentionally omitted
            // from commonMain: 2.8.x is Android-only; 2.9.0 added KMP metadata but ships
            // no iosArm64/iosSimulatorArm64 klibs, so it cannot satisfy this source set.
            // DeepLinks.kt holds plain URI-pattern strings for now; T12 (NavHost) will
            // wire navDeepLink{} on Android once an androidMain split exists.
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

// androidx.compose.material3.adaptive:adaptive:1.0.0 pulls in androidx.compose.*:1.6.5
// which lacks MathHelpersKt.fastCbrt required by the JetBrains Compose 1.7.1 Oklab
// colour-space converter (triggered by CheckboxDefaults.colors via animateColorAsState).
// Force the JetBrains 1.7.1 ui-util on the JVM test classpath so fastCbrt resolves.
configurations.named("jvmTestRuntimeClasspath") {
    resolutionStrategy.eachDependency {
        if (requested.group == "androidx.compose.ui" && requested.name == "ui-util-desktop") {
            useTarget("org.jetbrains.compose.ui:ui-util-desktop:1.7.1")
            because("fastCbrt missing in androidx 1.6.5; replaced by JetBrains Compose 1.7.1")
        }
    }
}

kover { reports { verify { rule { minBound(75) } } } }
