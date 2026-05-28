package org.revue_2_presse.data.mappers

object DeriveAuthorName {
    private val tldRegex = Regex("\\.[a-z.]+$", RegexOption.IGNORE_CASE)

    fun from(handle: String?): String {
        if (handle.isNullOrBlank()) return "Inconnu"
        val stem = handle.replace(tldRegex, "")
        return if (stem.isEmpty()) "Inconnu" else stem.replaceFirstChar { it.uppercaseChar() }
    }
}
