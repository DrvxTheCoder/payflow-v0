import { cn } from "@/lib/utils"

type BrandKey = "segment" | "focalpoint" | "biosyntesis" | "galileo"

const styles: Record<BrandKey, string> = {
  segment: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  focalpoint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  biosyntesis: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  galileo: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
}

export function BrandIcon({
  brand,
  className,
}: {
  brand: BrandKey
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full",
        styles[brand],
        className,
      )}
      aria-hidden="true"
    >
      {brand === "segment" && (
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <path
            d="M12 4a8 8 0 1 0 7.4 11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      )}
      {brand === "focalpoint" && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="11.3"
              y="2"
              width="1.4"
              height="8"
              rx="0.7"
              transform={`rotate(${i * 30} 12 12)`}
            />
          ))}
        </svg>
      )}
      {brand === "biosyntesis" && (
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.25" />
          <path
            d="M5 9c4 3 10 3 14 0M5 15c4-3 10-3 14 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {brand === "galileo" && (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12 4a8 8 0 1 0 0 16 6 6 0 0 1 0-16Z" />
        </svg>
      )}
    </span>
  )
}
