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
            implementation(project(":ui"))
            implementation(compose.desktop.currentOs)
            implementation(compose.material3)
        }
    }
}

compose.desktop {
    application {
        mainClass = "org.revue_2_presse.desktop.MainKt"
    }
}
