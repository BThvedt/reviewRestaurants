import React from "react"

const StringTrim = (
  str: string | undefined,
  len: number,
  ellipsis: boolean
): string => {
  if (!str) {
    return ""
  }

  if (str.length <= len) {
    return str
  }

  var trimmed = str.substr(0, len)

  return `${trimmed.substr(
    0,
    Math.min(trimmed.length, trimmed.lastIndexOf(" "))
  )}${ellipsis ? "..." : ""}`
}

export default StringTrim
