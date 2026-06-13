import { useState, useEffect } from "react"

// Drop-in replacement for useState that persists the value to sessionStorage
// under `key`. This lets table state (page, keyword, sort) survive navigating
// away to a detail page and back within the same browser session, instead of
// resetting to the default on every remount.
export const usePersistedState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : defaultValue
    } catch {
      // sessionStorage unavailable (e.g. private mode) — fall back to default.
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write errors (storage full/unavailable); state still works.
    }
  }, [key, value])

  return [value, setValue]
}
