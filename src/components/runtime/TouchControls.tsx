"use client";

import { useCallback, useRef } from "react";

function dispatchKeyEvent(key: string, code: number, type: "keydown" | "keyup") {
  window.dispatchEvent(
    new KeyboardEvent(type, {
      key,
      keyCode: code,
      which: code,
      code: key,
      bubbles: true,
      cancelable: true,
    })
  );
}

const BUTTONS = {
  left: { key: "ArrowLeft", code: 37, label: "Move left" },
  right: { key: "ArrowRight", code: 39, label: "Move right" },
  up: { key: "ArrowUp", code: 38, label: "Jump" },
} as const;

type ButtonId = keyof typeof BUTTONS;

function TouchBtn({
  id,
  className,
  children,
}: {
  id: ButtonId;
  className: string;
  children: React.ReactNode;
}) {
  const activeRef = useRef(false);

  const onStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (activeRef.current) return;
    activeRef.current = true;
    const { key, code } = BUTTONS[id];
    dispatchKeyEvent(key, code, "keydown");
  }, [id]);

  const onEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!activeRef.current) return;
    activeRef.current = false;
    const { key, code } = BUTTONS[id];
    dispatchKeyEvent(key, code, "keyup");
  }, [id]);

  return (
    <button
      type="button"
      className={className}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onTouchCancel={onEnd}
      aria-label={BUTTONS[id].label}
    >
      {children}
    </button>
  );
}

export function TouchControls() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 touch-none select-none">
      <div className="pointer-events-auto absolute bottom-8 left-4 flex gap-4 sm:bottom-10 sm:left-6">
        <TouchBtn
          id="left"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 sm:h-20 sm:w-20"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white sm:h-10 sm:w-10" fill="currentColor">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </TouchBtn>
        <TouchBtn
          id="right"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 sm:h-20 sm:w-20"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white sm:h-10 sm:w-10" fill="currentColor">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </TouchBtn>
      </div>
      <div className="pointer-events-auto absolute bottom-8 right-4 sm:bottom-10 sm:right-6">
        <TouchBtn
          id="up"
          className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 sm:h-24 sm:w-24"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="currentColor">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </TouchBtn>
      </div>
    </div>
  );
}
