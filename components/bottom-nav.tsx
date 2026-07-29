"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { QrCode01Icon } from "@hugeicons/core-free-icons"
import { bottomNavItems, isNavItemActive } from "@/lib/navigation"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Bottom Gradient Overlay 
        Creates the smooth fade from the background color to transparent, 
        sitting directly behind the floating nav. 
      */}
      <div 
        className="w-full fixed bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none z-40 lg:hidden" 
        aria-hidden="true" 
      />

      {/* Floating Navigation Wrapper */}
      <div className="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center px-4 lg:hidden pointer-events-none w-full">
        
        {/* Anchor point for the nav and the absolute positioned scan button */}
        <div className="relative pointer-events-auto">
          
          {/* Floating Scan Button */}
          <button 
            className="absolute -top-20 right-0 md:-right-30 flex items-center justify-center size-16 bg-foreground text-background rounded-full shadow-xl transition-transform active:scale-95"
            aria-label="Scan QR Code"
          >
            <HugeiconsIcon icon={QrCode01Icon} className="size-7" />
          </button>

          {/* Main Pill Container */}
          <nav className="flex items-center gap-2 p-2 bg-card/95 backdrop-blur-xl border border-border shadow-md rounded-full">
            {bottomNavItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href)

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative z-10"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    layout // Framer Motion magic for smooth width expansion
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className={cn(
                      "flex items-center justify-center overflow-hidden rounded-full p-2 bg-muted",
                      isActive ? "w-36 min-w-32 justify-start brightness-95" : "text-foreground hover:brightness-95"
                    )}
                  >
                    <div className={cn("relative flex justify-center items-center size-12 rounded-full", isActive && "dark:bg-muted-foreground/30 bg-black ")}>
                        {item.hugeicons ? (
                          <HugeiconsIcon icon={item.icon} className={cn("shrink-0 size-5", isActive && "text-white dark:text-primary")} />
                        ) : (
                          <item.icon className={cn("shrink-0 size-5", isActive && "text-white dark:text-primary")} />
                        )}
                        {/* Not-yet-built destination: subtle muted dot, never a disabled state */}
                        {item.status === "placeholder" && (
                          <span
                            aria-hidden="true"
                            className="absolute right-2 top-2 size-1.5 rounded-full bg-muted-foreground/50"
                          />
                        )}
                    </div>
                    
                    
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.span
                          layout
                          initial={{ opacity: 0, filter: "blur(4px)", marginLeft: 0 }}
                          animate={{ opacity: 1, filter: "blur(0px)", marginLeft: 8 }}
                          exit={{ opacity: 0, filter: "blur(4px)", marginLeft: 0 }}
                          transition={{ 
                            duration: 0.2, 
                            ease: "easeInOut" 
                          }}
                          className="font-bold text-xs tracking-tight whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}