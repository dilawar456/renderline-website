"use client";
import { useSyncExternalStore } from "react";
function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === "renderline-theme" &&
      (event.newValue === "light" || event.newValue === "dark")
    )
      document.documentElement.dataset.theme = event.newValue;
    listener();
  };
  window.addEventListener("renderline-theme", listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("renderline-theme", listener);
    window.removeEventListener("storage", onStorage);
  };
}
const snapshot = () => document.documentElement.dataset.theme !== "light";
export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => true);
  return (
    <button
      className="rl-theme-switch"
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = dark ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("renderline-theme", next);
        } catch {}
        window.dispatchEvent(new Event("renderline-theme"));
      }}
    >
      <span className="rl-theme-thumb" />
      <svg
        className="theme-sun"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </svg>
      <svg
        className="theme-moon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M20.7 15.5A9.5 9.5 0 0 1 8.5 3.3a9.6 9.6 0 1 0 12.2 12.2Z" />
      </svg>
    </button>
  );
}
