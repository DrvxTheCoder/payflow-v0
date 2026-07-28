"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, History, Settings, ScanLine } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { QrCode01Icon } from "@hugeicons/core-free-icons"

export function BottomNav() {
  const pathname = usePathname()

  // Mapped to your exact screenshots
  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Cards", href: "/cards", icon: CreditCard },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Bottom Gradient Overlay 
        Creates the smooth fade from the background color to transparent, 
        sitting directly behind the floating nav. 
      */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none z-40 md:hidden" 
        aria-hidden="true" 
      />

      {/* Floating Navigation Wrapper */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
        
        {/* Anchor point for the nav and the absolute positioned scan button */}
        <div className="relative pointer-events-auto">
          
          {/* Floating Scan Button */}
          <button 
            className="absolute -top-20 right-0 flex items-center justify-center size-16 bg-foreground text-background rounded-full shadow-xl transition-transform active:scale-95"
            aria-label="Scan QR Code"
          >
            <HugeiconsIcon icon={QrCode01Icon} className="size-7" />
          </button>

          {/* Main Pill Container */}
          <nav className="flex items-center gap-2 p-2 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="relative z-10"
                  aria-label={item.name}
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
                      isActive ? "justify-start" : "text-foreground hover:brightness-95"
                    )}
                  >
                    <div className="flex justify-center items-center size-12 bg-secondary rounded-full">
                        <Icon className={cn("shrink-0 size-5", isActive && "text-primary")} />
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
                          className="font-semibold text-xs tracking-tight whitespace-nowrap"
                        >
                          {item.name}
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