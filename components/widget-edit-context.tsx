"use client"

import * as React from "react"

type WidgetEditContextValue = {
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  /** True while a route below the shell is rendering a draggable grid. */
  hasGrid: boolean
  /** Call on mount from a grid; invoke the returned cleanup on unmount. */
  registerGrid: () => () => void
}

const WidgetEditContext = React.createContext<WidgetEditContextValue | null>(null)

export function WidgetEditProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [gridCount, setGridCount] = React.useState(0)

  const registerGrid = React.useCallback(() => {
    setGridCount((count) => count + 1)
    return () => {
      setGridCount((count) => Math.max(0, count - 1))
      setIsEditing(false)
    }
  }, [])

  const value = React.useMemo<WidgetEditContextValue>(
    () => ({ isEditing, setIsEditing, hasGrid: gridCount > 0, registerGrid }),
    [isEditing, gridCount, registerGrid],
  )

  return (
    <WidgetEditContext.Provider value={value}>
      {children}
    </WidgetEditContext.Provider>
  )
}

export function useWidgetEdit() {
  const context = React.useContext(WidgetEditContext)
  if (!context) {
    throw new Error("useWidgetEdit must be used within a WidgetEditProvider")
  }
  return context
}
