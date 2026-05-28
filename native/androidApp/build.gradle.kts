plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
}

kotlin {
    androidTarget {
        compilations.all { kotlinOptions.jvmTarget = "21" }
    }
    sourceSets {
        androidMain.dependencies {
            implementation(project(":domain"))
            implementation(project(":data"))
            implementation(project(":design"))
            implementation(project(":ui"))
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation("androidx.activity:activity-compose:1.9.3")
            implementation("io.insert-koin:koin-android:${libs.versions.koin.get()}")
            implementation(libs.koin.compose)
        }
    }
}

android {
    namespace = "org.revue_2_presse"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        applicationId = "org.revue_2_presse"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()
        versionCode = libs.versions.appVersionCode.get().toInt()
        versionName = libs.versions.appVersionName.get()
    }

    signingConfigs {
        create("release") {
            storeFile = rootProject.file("../nuxt/android.keystore")
            storePassword = providers.environmentVariable("ANDROID_KEYSTORE_PASSWORD").orNull
                ?: providers.gradleProperty("ANDROID_KEYSTORE_PASSWORD").orNull
            keyAlias = "org.revue-de-presse"
            keyPassword = providers.environmentVariable("ANDROID_KEY_PASSWORD").orNull
                ?: providers.gradleProperty("ANDROID_KEY_PASSWORD").orNull
        }
    }

    buildTypes {
        debug { isMinifyEnabled = false }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = signingConfigs["release"]
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
}
