package org.revue_2_presse.desktop

import java.awt.Taskbar
import java.awt.Toolkit
import javax.imageio.ImageIO

// macOS shows two "icons" for a Java app:
//   - the Window icon (top-left of the AWT window) → Window(icon=...) in Main.kt
//   - the Application icon (Dock, Cmd+Tab, Option+Tab switcher) → java.awt.Taskbar
// Without explicitly setting the Application icon the app shows the generic
// Java coffee cup.
//
// We bake the SVG to a PNG at the source tree (resources/logo-dock.png, rebuilt
// via rsvg-convert) so the runtime path is a straight ImageIO read — no Skiko
// rasterisation, no compose-resources lookup, no need for the SVG parser to be
// healthy. Falls back silently if the platform doesn't support the call.
fun installRevueDePresseDockIcon() {
    val image = runCatching {
        ClassLoader.getSystemResourceAsStream("logo-dock.png")
            ?.use { ImageIO.read(it) }
    }.getOrNull() ?: return

    // Force AWT to initialise before asking the Taskbar API — Taskbar.getTaskbar()
    // is unreliable on macOS until the toolkit is up.
    runCatching { Toolkit.getDefaultToolkit() }

    if (!Taskbar.isTaskbarSupported()) return
    val taskbar = runCatching { Taskbar.getTaskbar() }.getOrNull() ?: return
    if (!taskbar.isSupported(Taskbar.Feature.ICON_IMAGE)) return
    runCatching { taskbar.iconImage = image }
}
