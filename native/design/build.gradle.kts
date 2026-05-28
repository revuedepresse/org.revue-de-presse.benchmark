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
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.materialIconsExtended)
            implementation(compose.components.resources)
            implementation(libs.androidx.compose.material3.adaptive)
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
            @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
            implementation(compose.uiTest)
        }
        jvmTest.dependencies {
            implementation(compose.desktop.currentOs)
        }
    }
}

val emitComposeTokens = tasks.register<Exec>("emitComposeTokens") {
    workingDir = rootDir.resolve("../design-system")
    val outDir = layout.buildDirectory.dir("generated/kotlin").get().asFile
    commandLine("node", "scripts/emit-compose-tokens.mjs", "--out", outDir.path)
    inputs.file(rootDir.resolve("../design-system/research/live-tokens.json"))
    inputs.file(rootDir.resolve("../design-system/scripts/emit-compose-tokens.mjs"))
    outputs.dir(outDir)
}
kotlin.sourceSets["commonMain"].kotlin.srcDir(emitComposeTokens)

kover {
    reports { verify { rule { minBound(60) } } }
}
