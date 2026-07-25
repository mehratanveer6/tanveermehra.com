"use client";

import { useEffect, useRef } from "react";

/**
 * Deliberately minimal: a small dot glued to the pointer and a ring that
 * eases toward it, widening slightly over interactive elements. No trail,
 * no color, no cursor replacement on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      const scale = hoverRef.current ? 1.6 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.borderColor = hoverRef.current
          ? "rgba(242, 241, 238, 0.5)"
          : "rgba(242, 241, 238, 0.2)";
      }
      frame = requestAnimationFrame(tick);
    };

    const interactiveSelector = "a, button, [data-cursor-hover]";
    const handleOver = (event: MouseEvent) => {
      if ((event.target as HTMLElement)?.closest(interactiveSelector)) {
        hoverRef.current = true;
      }
    };
    const handleOut = (event: MouseEvent) => {
      if ((event.target as HTMLElement)?.closest(interactiveSelector)) {
        hoverRef.current = false;
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      <div ref={dotRef} className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-paper" />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-8 w-8 rounded-full border transition-[border-color] duration-300"
        style={{ borderColor: "rgba(242, 241, 238, 0.2)" }}
      />
    </div>
  );
}
