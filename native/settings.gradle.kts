pluginManagement {
    repositories {
        google { content { includeGroupByRegex("com\\.android.*"); includeGroupByRegex("androidx.*"); includeGroupByRegex("com\\.google.*") } }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "native"

include(":domain", ":data", ":design", ":ui", ":androidApp", ":iosApp", ":desktopApp")
