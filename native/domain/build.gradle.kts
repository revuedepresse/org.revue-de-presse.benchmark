plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.kover)
}

kotlin {
    jvm()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.datetime)
            implementation(libs.kotlinx.serialization.json)
        }
        commonTest.dependencies {
            implementation(kotlin("test"))
            implementation(libs.kotlinx.coroutines.test)
            implementation(libs.turbine)
        }
    }
}

kover {
    reports { verify { rule { minBound(90) } } }
}

val emitComposeStrings = tasks.register<Exec>("emitComposeStrings") {
    workingDir = rootDir.resolve("../design-system")
    val outDir = layout.buildDirectory.dir("generated/kotlin").get().asFile
    commandLine("node", "scripts/emit-compose-strings.mjs", "--out", outDir.path)
    inputs.dir(rootDir.resolve("../design-system/output/vue/src/locales"))
    inputs.file(rootDir.resolve("../design-system/scripts/emit-compose-strings.mjs"))
    outputs.dir(outDir)
}

kotlin.sourceSets["commonMain"].kotlin.srcDir(emitComposeStrings)
