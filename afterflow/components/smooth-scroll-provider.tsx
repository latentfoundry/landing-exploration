"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

const exponentialEaseOut = (progress: number) =>
  Math.min(1, 1.001 - 2 ** (-10 * progress));

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        anchors: { duration: 0.9, easing: exponentialEaseOut },
        autoRaf: true,
        duration: 1,
        easing: exponentialEaseOut,
        respectReducedMotion: true,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
