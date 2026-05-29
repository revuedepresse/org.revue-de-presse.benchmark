@file:OptIn(org.jetbrains.compose.resources.InternalResourceApi::class)

package native.design.generated.resources

import kotlin.OptIn
import kotlin.String
import kotlin.collections.MutableMap
import org.jetbrains.compose.resources.FontResource
import org.jetbrains.compose.resources.InternalResourceApi

private object CommonMainFont0 {
  public val Roboto_Medium: FontResource by 
      lazy { init_Roboto_Medium() }

  public val Roboto_Regular: FontResource by 
      lazy { init_Roboto_Regular() }

  public val Signika_Regular: FontResource by 
      lazy { init_Signika_Regular() }
}

@InternalResourceApi
internal fun _collectCommonMainFont0Resources(map: MutableMap<String, FontResource>) {
  map.put("Roboto_Medium", CommonMainFont0.Roboto_Medium)
  map.put("Roboto_Regular", CommonMainFont0.Roboto_Regular)
  map.put("Signika_Regular", CommonMainFont0.Signika_Regular)
}

internal val Res.font.Roboto_Medium: FontResource
  get() = CommonMainFont0.Roboto_Medium

private fun init_Roboto_Medium(): FontResource = org.jetbrains.compose.resources.FontResource(
  "font:Roboto_Medium",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/font/Roboto-Medium.ttf", -1, -1),
    )
)

internal val Res.font.Roboto_Regular: FontResource
  get() = CommonMainFont0.Roboto_Regular

private fun init_Roboto_Regular(): FontResource = org.jetbrains.compose.resources.FontResource(
  "font:Roboto_Regular",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/font/Roboto-Regular.ttf", -1, -1),
    )
)

internal val Res.font.Signika_Regular: FontResource
  get() = CommonMainFont0.Signika_Regular

private fun init_Signika_Regular(): FontResource = org.jetbrains.compose.resources.FontResource(
  "font:Signika_Regular",
    setOf(
      org.jetbrains.compose.resources.ResourceItem(setOf(),
    "composeResources/native.design.generated.resources/font/Signika-Regular.ttf", -1, -1),
    )
)
