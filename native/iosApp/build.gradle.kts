plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}

kotlin {
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    val xcfName = "Shared"
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget::class.java).forEach {
        it.binaries.framework {
            baseName = xcfName
            isStatic = true
            export(project(":domain"))
            export(project(":data"))
            export(project(":design"))
            export(project(":ui"))
        }
    }

    sourceSets {
        iosMain.dependencies {
            implementation(project(":domain"))
            implementation(project(":data"))
            implementation(project(":design"))
            implementation(project(":ui"))
        }
    }
}
