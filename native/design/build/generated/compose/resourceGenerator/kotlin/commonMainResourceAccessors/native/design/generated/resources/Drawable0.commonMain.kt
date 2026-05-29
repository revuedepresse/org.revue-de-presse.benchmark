@file:OptIn(org.jetbrains.compose.resources.InternalResourceApi::class)

package native.design.generated.resources

import kotlin.OptIn
import kotlin.String
import kotlin.collections.MutableMap
import org.jetbrains.compose.resources.DrawableResource
import org.jetbrains.compose.resources.InternalResourceApi

private object CommonMainDrawable0 {
  public val bluesky: DrawableResource by 
      lazy { init_bluesky() }

  public val icon_funding: DrawableResource by 
      lazy { init_icon_funding() }

  public val icon_introducing: DrawableResource by 
      lazy { init_icon_introducing() }

  public val icon_sharing: DrawableResource by 
      lazy { init_icon_sharing() }

  public val logo: DrawableResource by 
      lazy { init_logo() }

  public val netlify_mark: DrawableResource by 
      lazy { init_netlify_mark() }

  public val play_store_badge: DrawableResource by 
      lazy { init_play_store_badge() }
}

@InternalResourceApi
internal fun _collectCommonMainDrawable0Resources(map: MutableMap<String, DrawableResource>) {
  map.put("bluesky", CommonMainDrawable0.bluesky)
  map.put("icon_funding", CommonMainDrawable0.icon_funding)
  map.put("icon_introducing", CommonMainDrawable0.icon_introducing)
  map.put("icon_sharing", CommonMainDrawable0.icon_sharing)
  map.put("logo", CommonMainDrawable0.logo)
  map.put("netlify_mark", CommonMainDrawable0.netlify_mark)
  map.put("play_store_badge", CommonMainDrawable0.play_store_badge)
}

internal val Res.drawable.bluesky: DrawableResource
  get() = CommonMainDrawable0.bluesky

private fun init_bluesky(): DrawableResource = org.jetbrains.compose.resources.DrawableResource(
  "drawable:bluesky",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/bluesky.svg", -1, -1),
    )
)

internal val Res.drawable.icon_funding: DrawableResource
  get() = CommonMainDrawable0.icon_funding

private fun init_icon_funding(): DrawableResource =
    org.jetbrains.compose.resources.DrawableResource(
  "drawable:icon_funding",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/icon_funding.svg", -1, -1),
    )
)

internal val Res.drawable.icon_introducing: DrawableResource
  get() = CommonMainDrawable0.icon_introducing

private fun init_icon_introducing(): DrawableResource =
    org.jetbrains.compose.resources.DrawableResource(
  "drawable:icon_introducing",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/icon_introducing.svg", -1, -1),
    )
)

internal val Res.drawable.icon_sharing: DrawableResource
  get() = CommonMainDrawable0.icon_sharing

private fun init_icon_sharing(): DrawableResource =
    org.jetbrains.compose.resources.DrawableResource(
  "drawable:icon_sharing",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/icon_sharing.svg", -1, -1),
    )
)

internal val Res.drawable.logo: DrawableResource
  get() = CommonMainDrawable0.logo

private fun init_logo(): DrawableResource = org.jetbrains.compose.resources.DrawableResource(
  "drawable:logo",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/logo.svg", -1, -1),
    )
)

internal val Res.drawable.netlify_mark: DrawableResource
  get() = CommonMainDrawable0.netlify_mark

private fun init_netlify_mark(): DrawableResource =
    org.jetbrains.compose.resources.DrawableResource(
  "drawable:netlify_mark",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/netlify_mark.png", -1, -1),
    )
)

internal val Res.drawable.play_store_badge: DrawableResource
  get() = CommonMainDrawable0.play_store_badge

private fun init_play_store_badge(): DrawableResource =
    org.jetbrains.compose.resources.DrawableResource(
  "drawable:play_store_badge",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/drawable/play_store_badge.png", -1, -1),
    )
)
