"use client";

import * as React from "react";
import { motion, useAnimation, type HTMLMotionProps } from "motion/react";
import { RotateCcw } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof buttonVariants>;

export interface RefreshButtonProps
  extends Omit<ButtonProps, "children" | "asChild"> {
  /** Called on tap. Can be async — awaited before resetting the animation. */
  onRefresh?: () => void | Promise<void>;
  /** Icon size in px. @default 14 */
  iconSize?: number;
  /** Optional text label displayed next to the icon. */
  label?: string;
}

export function RefreshButton({
  className,
  variant = "default",
  size,
  onRefresh,
  iconSize = 14,
  label,
  disabled,
  ...props
}: RefreshButtonProps) {
  const rotateControls = useAnimation();
  const resolvedSize = size ?? (label ? "sm" : "icon-sm");
  // Accumulated rotation — always increments negatively so it never reverses
  const totalRotation = React.useRef(0);

  const animateTo = React.useCallback(
    (delta: number, transition: object) => {
      totalRotation.current += delta;
      return rotateControls.start({
        rotate: totalRotation.current,
        transition,
      });
    },
    [rotateControls],
  );

  return (
    <motion.button
      className={cn(
        buttonVariants({ variant, size: resolvedSize }),
        "flex items-center rounded-lg select-none",
        className,
      )}
      onTapStart={() =>
        animateTo(30, { type: "spring", stiffness: 400, damping: 25 })
      }
      onTap={async () => {
        await onRefresh?.();
        await animateTo(-390, {
          type: "spring",
          stiffness: 200,
          damping: 18,
        });
      }}
      onTapCancel={() =>
        animateTo(340, { type: "spring", stiffness: 200, damping: 18 })
      }
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      disabled={disabled}
      {...props}
    >
      <motion.span className="inline-flex self-center" animate={rotateControls}>
        <RotateCcw aria-label="restart-btn" size={iconSize} />
      </motion.span>
      {label && <span>{label}</span>}
    </motion.button>
  );
}
