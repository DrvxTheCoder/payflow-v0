"use client"

import * as React from "react"
import { motion, LayoutGroup } from "motion/react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  activeTab: string
  setActiveTab: (value: string) => void
  layoutId: string
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  layoutId: "",
})

function Tabs({
  defaultValue = "",
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [internal, setInternal] = React.useState(defaultValue)
  const activeTab = value ?? internal
  const layoutId = React.useId()

  const setActiveTab = React.useCallback(
    (v: string) => {
      setInternal(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, layoutId }}>
      <LayoutGroup id={layoutId}>
        <div className={cn("flex flex-col", className)}>{children}</div>
      </LayoutGroup>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("relative flex items-center gap-4 border-b border-border", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { activeTab, setActiveTab, layoutId } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative pb-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId={`${layoutId}-indicator`}
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
    </button>
  )
}

// Intentionally no animation — callers that need transitions should wrap
// their content in a single <AnimatePresence> keyed on the active tab value.
// Multiple AnimatePresence instances cannot coordinate timing with each other,
// which causes stacking artefacts when both exit/enter run simultaneously.
function TabsContent({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { activeTab } = React.useContext(TabsContext)
  if (activeTab !== value) return null
  return (
    <div className={cn("outline-none", className)} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
