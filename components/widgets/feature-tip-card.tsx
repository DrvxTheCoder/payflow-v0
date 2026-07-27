"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export interface FeatureTipCard {
  name?: React.ReactNode;
  description?: React.ReactNode;
  mediaSrc: string; // Path to .mp4, .webm, or .gif
  mediaClassName?: string;
  containerClassName?: string;
  fadeBottom?: boolean;
}

export interface FeatureTipCardsProps {
  items: FeatureTipCard[];
  className?: string;
}

function FeatureTipCard({ item }: { item: FeatureTipCard }) {
  // Check if file is a legacy GIF or modern video format
  const isVideo = item.mediaSrc.endsWith(".mp4") ;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group flex flex-col size-full relative"
    >
      <div
        className={cn(
          "flex flex-col border h-72 z-5 bg-surface transition-colors w-full p-0 border-border overflow-hidden",
          item.containerClassName
        )}
      >
        <div className="relative w-full h-full px-5 pt-6 pb-4 flex flex-col">
          {/* Headline support for string or custom JSX */}
          <div className="w-full pointer-events-none">
            {item.name}
          </div>

          {/* Subtitle description rendered inside the main flow */}
          <div className="w-full text-center text-xs md:text-base font-medium text-white leading-snug">
            {item.description}
          </div>

          {/* Render modern video loop or fallback gif */}
          {isVideo ? (
            <video
              src={item.mediaSrc}
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
              className={cn("object-cover", item.mediaClassName)}
            />
          ) : (
            <img
              src={item.mediaSrc}
              alt=""
              className={cn("object-cover", item.mediaClassName)}
            />
          )}

          {item.fadeBottom && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-surface to-transparent z-10" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureTipCards({ items, className }: FeatureTipCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 w-full", className)}>
      {items.map((item, index) => (
        <FeatureTipCard key={index} item={item} />
      ))}
    </div>
  );
}

export { FeatureTipCards, FeatureTipCard };
