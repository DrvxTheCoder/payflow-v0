"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

interface TrustKycAnimatedLogoProps {
  className?: string
  /** Width/height in px, or any CSS size value. Aspect ratio is preserved. */
  size?: number | string
  /** Any valid CSS color. Defaults to currentColor so it inherits text color. */
  color?: string
}

export function TrustKycAnimatedLogo({
  className,
  size = 64,
  color = "currentColor",
}: TrustKycAnimatedLogoProps) {
  const uid = useId().replace(/:/g, "")
  const trustClipId = `trustClip-${uid}`
  const kycClipId = `kycClip-${uid}`

  const width = typeof size === "number" ? `${size}px` : size
  const height = typeof size === "number" ? `${(size as number) * (98.09 / 265.01)}px` : size

  return (
    <svg
      viewBox="-6 -6 277 110"
      width={width}
      height={height}
      style={{ color, background: "transparent" }}
      className={cn(className)}
    >
      <defs>
        <style>{`
          .icon-grp-${uid} { animation: icon-move-${uid} 5s cubic-bezier(.5,0,.5,1) infinite; }
          @keyframes icon-move-${uid} {
            0%,28%   { transform: translateX(101.8px); }
            44%      { transform: translateX(0); }
            80%      { transform: translateX(0); }
            92%,100% { transform: translateX(101.8px); }
          }

          .icon-outline-${uid} {
            fill:none; stroke:currentColor; stroke-width:1.6; stroke-miterlimit:10;
            stroke-dasharray:380; stroke-dashoffset:380;
            animation: draw-${uid} 5s cubic-bezier(.65,0,.35,1) infinite;
          }
          @keyframes draw-${uid} {
            0%   { stroke-dashoffset:380; opacity:1; }
            22%  { stroke-dashoffset:0;   opacity:1; }
            28%  { stroke-dashoffset:0;   opacity:0; }
            100% { stroke-dashoffset:0;   opacity:0; }
          }

          .icon-fill-${uid} {
            fill:currentColor; opacity:0;
            animation: fillop-${uid} 5s cubic-bezier(.65,0,.35,1) infinite;
          }
          @keyframes fillop-${uid} {
            0%,12% { opacity:0; }
            25%    { opacity:1; }
            92%    { opacity:1; }
            100%   { opacity:0; }
          }

          .trust-slide-${uid} { animation: trust-slide-${uid} 5s cubic-bezier(.5,0,.5,1) infinite; }
          @keyframes trust-slide-${uid} {
            0%,28%   { transform: translateX(-102px); }
            44%      { transform: translateX(0); }
            80%      { transform: translateX(0); }
            92%,100% { transform: translateX(-102px); }
          }

          .kyc-grp-${uid} { animation: kyc-move-${uid} 5s cubic-bezier(.5,0,.5,1) infinite; }
          @keyframes kyc-move-${uid} {
            0%,36%   { transform: translateY(-26px); opacity:0; }
            46%      { transform: translateY(0);     opacity:1; }
            70%      { transform: translateY(0);     opacity:1; }
            80%,100% { transform: translateY(-26px); opacity:0; }
          }
        `}</style>

        <clipPath id={trustClipId}>
          <rect y="-6" width="260" height="76">
            <animate
              attributeName="x"
              dur="5s"
              repeatCount="indefinite"
              keyTimes="0;0.28;0.44;0.80;0.92;1"
              values="166;166;64;64;166;166"
              calcMode="spline"
              keySplines=".5 0 .5 1;.5 0 .5 1;.5 0 .5 1;.5 0 .5 1;.5 0 .5 1"
            />
          </rect>
        </clipPath>
        <clipPath id={kycClipId}>
          <rect x="200" y="66" width="70" height="38" />
        </clipPath>
      </defs>

      {/* ===== TRUST (slides out from behind icon, revealed by tracking clip) ===== */}
      <g clipPath={`url(#${trustClipId})`}>
        <g className={`trust-slide-${uid}`} fill={color}>
          <path d="M99.3,63.17h-12.07V14.77h-18.19V2.66h48.4v12.11h-18.15v48.4Z" />
          <path d="M121.97,63.17h-11.52v-27.28c0-1.61.27-3.21.82-4.73.65-1.78,1.71-3.82,3.44-5.72.77-.85,1.57-1.54,2.32-2.11.61-.56,1.44-1.24,2.49-1.93,1.38-.91,2.88-1.65,4.49-2.21,2.28-.8,4.7-1.13,7.11-1.13h9.75v11.48h-10.17c-1.21,0-2.35.23-3.42.68-1.07.45-2,1.07-2.78,1.86-.79.79-1.41,1.72-1.86,2.79-.45,1.07-.68,2.21-.68,3.42v24.9Z" />
          <path d="M174.22,17.98h-.04v24.98c0,1.21-.23,2.38-.68,3.52s-1.07,2.16-1.86,3.06c-.78.9-1.71,1.63-2.76,2.18-.85.43-1.74.7-2.67.79-.22.02-.46.03-.69.03h-.04c-.23,0-.46-.01-.68-.03-.93-.09-1.82-.36-2.67-.79-1.06-.55-1.98-1.28-2.77-2.18-.78-.9-1.4-1.92-1.85-3.06s-.68-2.31-.68-3.52v-24.98h-11.52v24.98c0,3.23.53,6.15,1.58,8.76,1.06,2.6,2.51,4.81,4.35,6.62.07.07.13.13.2.19,1.79,1.73,3.88,3.06,6.24,4.01,2.09.84,4.32,1.31,6.66,1.43.03,0,.05,0,.08,0,.33.03.67.04,1,.04h.16c.31,0,.62-.01.93-.04.05,0,.1-.01.15-.01.02,0,.05,0,.07,0,2.32-.13,4.52-.59,6.6-1.42,2.36-.94,4.43-2.28,6.23-4.01.07-.06.14-.12.21-.19,1.84-1.81,3.29-4.02,4.34-6.62,1.06-2.61,1.59-5.53,1.59-8.76v-24.98h-11.48Z" />
          <path d="M219.28,63.17h-26.33v-11.48h26.33c.79,0,1.46-.28,2.03-.84.56-.56.84-1.24.84-2.03s-.28-1.35-.84-1.6c-.56-.25-1.24-.38-2.03-.38h-11.98c-2,0-3.87-.38-5.61-1.14-1.74-.76-3.26-1.79-4.56-3.1-1.29-1.31-2.31-2.83-3.06-4.58-.75-1.74-1.12-3.61-1.12-5.61s.37-3.87,1.12-5.61c.75-1.74,1.77-3.26,3.06-4.56s2.81-2.31,4.56-3.06c1.74-.75,3.61-1.12,5.61-1.12h23.34v11.48h-23.34c-.79,0-1.46.28-2.03.84s-.84,1.24-.84,2.03.28,1.51.84,2.09c.56.58,1.24.87,2.03.87h11.98c1.97,0,3.83.33,5.57.99,1.74.66,3.26,1.58,4.56,2.76,1.29,1.18,2.32,2.6,3.08,4.26.76,1.66,1.14,3.47,1.14,5.44s-.38,3.86-1.14,5.59c-.76,1.73-1.79,3.25-3.08,4.56-1.29,1.31-2.81,2.34-4.56,3.08-1.74.75-3.6,1.12-5.57,1.12Z" />
          <path d="M256.28,63.17c-2.79,0-5.4-.53-7.85-1.58-2.45-1.05-4.59-2.5-6.44-4.35-1.84-1.84-3.29-3.99-4.35-6.44-1.05-2.45-1.58-5.06-1.58-7.85V0h11.48v18.06h17.47v11.48h-17.47v13.42c0,1.21.23,2.34.68,3.4.45,1.05,1.07,1.98,1.86,2.76.79.79,1.72,1.41,2.78,1.88,1.07.46,2.21.7,3.42.7h8.73v11.48h-8.73Z" />
        </g>
      </g>

      {/* ===== KYC (slides down from under TRUST) ===== */}
      <g clipPath={`url(#${kycClipId})`}>
        <g className={`kyc-grp-${uid}`} fill={color}>
          <path d="M207.04,97.57h-4.88v-24.39h4.88v12.2l9.08-12.2h5.55l-7.71,10.29,7.71,14.1h-5.55l-5.36-9.87-3.73,4.98v4.88Z" />
          <path d="M234.91,97.57h-4.86v-7.64c-1.08-.27-2.07-.71-2.97-1.31-.9-.6-1.68-1.32-2.32-2.15-.65-.83-1.15-1.76-1.51-2.77-.36-1.01-.54-2.08-.54-3.21v-7.31h4.88v7.31c0,.67.13,1.3.38,1.9.26.6.6,1.11,1.05,1.56s.96.79,1.56,1.05c.6.26,1.23.38,1.9.38s1.3-.13,1.9-.38c.6-.26,1.11-.6,1.56-1.05s.79-.96,1.05-1.56.38-1.23.38-1.9v-7.31h4.86v7.31c0,1.12-.18,2.19-.54,3.21-.36,1.02-.86,1.94-1.51,2.77-.65.83-1.42,1.55-2.31,2.15-.9.6-1.88,1.04-2.96,1.31v7.64Z" />
          <path d="M265.01,95.07c-1.13.98-2.4,1.72-3.81,2.25-1.41.52-2.86.78-4.37.78-1.16,0-2.27-.15-3.34-.45-1.07-.3-2.08-.73-3.01-1.28-.94-.55-1.79-1.21-2.56-1.98-.77-.77-1.43-1.62-1.98-2.56-.55-.94-.98-1.94-1.28-3.01-.3-1.07-.45-2.19-.45-3.34s.15-2.27.45-3.35c.3-1.08.73-2.08,1.28-3.02.55-.94,1.21-1.79,1.98-2.56.77-.77,1.62-1.43,2.56-1.98.94-.55,1.94-.98,3.01-1.28,1.07-.3,2.19-.45,3.34-.45,1.51,0,2.97.26,4.37.77,1.41.52,2.68,1.27,3.81,2.25l-2.59,4.25c-.71-.77-1.56-1.36-2.53-1.78-.98-.41-2-.62-3.06-.62s-2.09.2-3.03.61c-.94.41-1.76.96-2.47,1.66-.7.7-1.26,1.52-1.67,2.47-.41.95-.61,1.95-.61,3.02s.2,2.07.61,3c.41.94.96,1.76,1.67,2.46.7.7,1.52,1.26,2.47,1.67.94.41,1.95.61,3.03.61s2.09-.21,3.06-.62c.98-.41,1.82-1.01,2.53-1.78l2.59,4.25Z" />
        </g>
      </g>

      {/* ===== ICON (on top, slides between center and lockup) ===== */}
      <g className={`icon-grp-${uid}`}>
        <path
          className={`icon-fill-${uid}`}
          d="M48.43,1.68H13.06C5.85,1.68,0,7.53,0,14.74v35.37c0,7.21,5.85,13.06,13.06,13.06h35.37c7.21,0,13.06-5.85,13.06-13.06V14.74c0-7.21-5.85-13.06-13.06-13.06ZM47.02,31.78c-7.8,2.6-13.8,9.18-15.59,17.32h-12.58c.94-6.7,3.75-12.81,7.86-17.8h-10.64v-12.34h12.98v9.76c4.84-4.83,11.04-8.3,17.98-9.76v12.82Z"
        />
        <path
          className={`icon-outline-${uid}`}
          d="M48.43,1.68H13.06C5.85,1.68,0,7.53,0,14.74v35.37c0,7.21,5.85,13.06,13.06,13.06h35.37c7.21,0,13.06-5.85,13.06-13.06V14.74c0-7.21-5.85-13.06-13.06-13.06ZM47.02,31.78c-7.8,2.6-13.8,9.18-15.59,17.32h-12.58c.94-6.7,3.75-12.81,7.86-17.8h-10.64v-12.34h12.98v9.76c4.84-4.83,11.04-8.3,17.98-9.76v12.82Z"
        />
      </g>
    </svg>
  )
}
