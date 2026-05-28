plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}

kotlin {
    jvm {
        compilations.all { kotlinOptions.jvmTarget = "21" }
        withJava()
        mainRun {
            mainClass.set("org.revue_2_presse.desktop.MainKt")
        }
    }
    sourceSets {
        jvmMain.dependencies {
            implementation(project(":domain"))
            implementation(project(":design"))
            implementation(project(":data"))
            implementation(project(":ui"))
            implementation(compose.desktop.currentOs)
            implementation(compose.material3)
            implementation(libs.kotlinx.datetime)
            implementation(libs.koin.core)
            implementation(libs.koin.compose)
            // SLF4J binding so Ktor's Logging plugin actually emits output;
            // without it we get the NOP provider and silently lose request errors.
            runtimeOnly("org.slf4j:slf4j-simple:2.0.16")
        }
    }
}

compose.desktop {
    application {
        mainClass = "org.revue_2_presse.desktop.MainKt"
    }
}

// Mirror the :ui fix to the desktop runtime: androidx.compose.material3.adaptive:1.0.0
// drags in androidx.compose.ui:ui-util-desktop:1.6.5 which lacks MathHelpersKt.fastCbrt,
// called at runtime by JetBrains Compose 1.7.1 (Bezier easing → Oklab interp). Force
// JetBrains 1.7.1 ui-util on every JVM runtime classpath so animations resolve.
configurations.matching { it.name.contains("RuntimeClasspath") && it.name.startsWith("jvm") }.configureEach {
    resolutionStrategy.eachDependency {
        if (requested.group == "androidx.compose.ui" && requested.name == "ui-util-desktop") {
            useTarget("org.jetbrains.compose.ui:ui-util-desktop:1.7.1")
            because("fastCbrt missing in androidx 1.6.5; replaced by JetBrains Compose 1.7.1")
        }
    }
}
