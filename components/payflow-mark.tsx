import { cn } from "@/lib/utils"

export function PayflowMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <path d="M12 0c.4 5.6 6.4 11.6 12 12-5.6.4-11.6 6.4-12 12-.4-5.6-6.4-11.6-12-12C5.6 11.6 11.6 5.6 12 0Z" />
    </svg>
  )
}
