"use client";

import { useState, useEffect } from "react";

export function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime({
        h: now.getHours().toString().padStart(2, "0"),
        m: now.getMinutes().toString().padStart(2, "0"),
        s: now.getSeconds().toString().padStart(2, "0"),
      });
    }
    tick();
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-baseline gap-1 transition-opacity duration-300"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <span
        className="text-[42px] font-black tracking-tighter leading-none tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
        suppressHydrationWarning
      >
        {time.h}:{time.m}
      </span>
      <span
        className="text-[22px] font-bold tracking-tighter text-green-400"
        suppressHydrationWarning
      >
        <span className="animate-pulse">:</span>{time.s}
      </span>
    </div>
  );
}
