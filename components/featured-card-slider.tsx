"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedCardSliderProps {
  slides: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
}

export function FeaturedCardSlider({
  slides,
  className,
  slideClassName,
  showArrows = true,
  showDots = true,
}: FeaturedCardSliderProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!slides.length) return null;

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-[#ebbd57] p-0">
        <div className="relative h-68 bg-[#ebbd57] p-0">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn("h-full w-full shrink-0", slideClassName)}
              >
                <div className="flex h-full w-full items-stretch justify-center">
                  {slide}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-foreground shadow-sm transition hover:bg-background/50 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-foreground shadow-sm transition hover:bg-background/50 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {showDots && slides.length > 1 && (
        <div className="mt-0 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === activeIndex
                  ? "scale-125 bg-foreground"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}