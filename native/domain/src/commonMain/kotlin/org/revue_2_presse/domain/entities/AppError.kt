package org.revue_2_presse.domain.entities

sealed class AppError {
    data object Offline : AppError()
    data object Timeout : AppError()
    data object Unauthorized : AppError()
    data object EmptyDay : AppError()
    data class UpstreamFailure(val status: Int) : AppError()

    companion object {
        fun from(t: Throwable): AppError = when {
            t.message?.contains("timeout", ignoreCase = true) == true -> Timeout
            t.message?.contains("unreachable", ignoreCase = true) == true -> Offline
            t.message?.contains("network", ignoreCase = true) == true -> Offline
            else -> UpstreamFailure(status = -1)
        }
    }
}
