"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/runs", label: "Runs", icon: "runs" },
  { href: "/errors", label: "Errors", icon: "errors" },
  { href: "/logs", label: "Logs", icon: "logs" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const liveEvents = [
  "run.started",
  "span.completed",
  "log.created",
  "error.created",
  "finding.created",
  "run.completed",
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource("/api/stream");
    const update = () => window.dispatchEvent(new Event("telemetry:refresh"));
    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.addEventListener("ready", () => {
      setConnected(true);
      update();
    });
    for (const eventName of liveEvents) source.addEventListener(eventName, update);
    return () => source.close();
  }, []);

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-label="Agent Observe">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h5l3 5 3-5h5M4 17h5l3-5 3 5h5" />
              <circle cx="4" cy="7" r="1.5" />
              <circle cx="20" cy="7" r="1.5" />
              <circle cx="4" cy="17" r="1.5" />
              <circle cx="20" cy="17" r="1.5" />
            </svg>
          </span>
        </Link>
        <div className="sidebar-caption">Workspace</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <span className="nav-icon" aria-hidden="true">
                  <NavigationIcon name={item.icon} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className={connected ? "health-dot connected" : "health-dot"} />
          <span className="health-label">
            {connected ? "Collector connected" : "Reconnecting to collector"}
          </span>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <span className="breadcrumb-brand">Agent Observe</span> <span>/</span>{" "}
            {navigation.find((item) =>
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
            )?.label ?? "Run detail"}
          </div>
          <div className="topbar-right">
            <span
              className={connected ? "live-indicator connected" : "live-indicator"}
              role="status"
              aria-label={connected ? "Live updates connected" : "Reconnecting to live updates"}
            >
              <i /> LIVE
            </span>
            <span className="version-label">v0.3.0</span>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function NavigationIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, ReactNode> = {
    overview: (
      <>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </>
    ),
    runs: (
      <>
        <path d="M4 6h4l3 6h2l3-6h4M4 18h4l3-6h2l3 6h4" />
        <circle cx="4" cy="6" r="1.2" />
        <circle cx="20" cy="18" r="1.2" />
      </>
    ),
    errors: (
      <>
        <path d="M12 3 21 20H3L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    logs: (
      <>
        <path d="M5 5h14M5 9h14M5 13h14M5 17h9" />
        <path d="M3 4h.01M3 8h.01M3 12h.01M3 16h.01" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19.4 15 .1.1 1.1.8-1.1 1.9-1.3-.5a7.7 7.7 0 0 1-1.7 1l-.2 1.4h-2.2l-.3-1.4a7.7 7.7 0 0 1-1.7-1l-1.3.5-1.1-1.9 1.1-.9a7 7 0 0 1 0-2l-1.1-.9 1.1-1.9 1.3.5a7.7 7.7 0 0 1 1.7-1l.3-1.4h2.2l.2 1.4a7.7 7.7 0 0 1 1.7 1l1.3-.5 1.1 1.9-1.1.9a7 7 0 0 1 0 2Z"
          transform="translate(-1 -1)"
        />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  );
}
