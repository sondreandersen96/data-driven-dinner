package no.sondre.domain

import java.util.UUID

fun unInitializedUUID(): UUID = UUID.fromString("00000000-0000-0000-0000-000000000000")

fun UUID.needsToBeInitialized(): Boolean = this == unInitializedUUID()

fun String.inList(l: List<String>) = l.contains(this)
