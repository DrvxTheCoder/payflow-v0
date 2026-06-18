import type { SVGProps } from "react"

export function GambiaFlagIcon({
  width,
  height,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="30" height="20" fill="#F5F5F5"/>
        <rect width="1876" height="988" transform="translate(-490 -328)" fill="white"/>
        <path d="M30 0H0V20H30V0Z" fill="#F0F0F0"/>
        <path d="M30 13.9131H0V20H30V13.9131Z" fill="#496E2D"/>
        <path d="M30 0H0V6.12406H30V0Z" fill="#A2001D"/>
        <path d="M30 7.35602H0V12.6094H30V7.35602Z" fill="#0052B4"/>
    </svg>
  )
}
