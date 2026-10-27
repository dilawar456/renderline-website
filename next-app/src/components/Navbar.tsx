"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./studio/ThemeToggle";
import { usePathname } from "next/navigation";
const links = [
  ["/services", "Services"],
  ["/portfolio", "Portfolio"],
  ["/pricing", "Pricing"],
  ["/drawing-samples", "Drawing samples"],
  ["/#how-it-works", "How it works"],
  ["/about", "About"],
  ["/contact", "Contact"],
];
export default function Navbar() {
  const path = usePathname();
  return <Navigation key={path} path={path} />;
}
function Navigation({ path }: { path: string }) {
  const [open, setOpen] = useState(false),
    toggle = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = [
          toggle.current,
          ...Array.from(
            menu.current?.querySelectorAll<HTMLElement>("a,button") || [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const media = window.matchMedia("(min-width: 1180px)");
    const onDesktop = () => {
      if (media.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onDesktop);
    };
  }, [open]);
  return (
    <header className="rl-nav">
      <div className="rl-nav-inner">
        <Link href="/" className="rl-brand" onClick={() => setOpen(false)}>
          <Image
            src="/assets/logo.png"
            alt=""
            width={42}
            height={42}
            priority
          />
          <span>
            RenderLine<small>Studio</small>
          </span>
        </Link>
        <nav className="rl-desktop-links" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <div className="rl-nav-actions">
          <Link href="/portal">Client portal</Link>
          <Link className="rl-button" href="/start-project">
            Start a project
          </Link>
        </div>
        <button
          ref={toggle}
          type="button"
          className="rl-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="studio-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d={open ? "M5 5l14 14M19 5L5 19" : "M3 7h18M3 12h18M3 17h18"}
            />
          </svg>
        </button>
      </div>
      <div
        ref={menu}
        id="studio-menu"
        className="rl-mobile-menu"
        hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile navigation">
          {[["/", "Home"], ...links, ["/portal", "Client portal"]].map(
            ([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </Link>
            ),
          )}
          <Link
            className="rl-button"
            href="/start-project"
            onClick={() => setOpen(false)}
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
