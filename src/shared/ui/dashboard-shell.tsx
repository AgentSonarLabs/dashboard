"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Overview", icon: "◫" },
  { href: "/runs", label: "Runs", icon: "⌁" },
  { href: "/errors", label: "Errors", icon: "⚠" },
  { href: "/logs", label: "Logs", icon: "▤" },
  { href: "/settings", label: "Settings", icon: "⚙" },
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
          <span className="brand-mark">A</span>
          <span>
            <strong>Agent Observe</strong>
            <small>SELF-HOSTED</small>
          </span>
        </Link>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                className={active ? "nav-link active" : "nav-link"}
                href={item.href}
                key={item.href}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className={connected ? "health-dot connected" : "health-dot"} />
          <span>{connected ? "Collector connected" : "Reconnecting to collector"}</span>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            Agent Observe <span>/</span>{" "}
            {navigation.find((item) =>
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
            )?.label ?? "Run detail"}
          </div>
          <div className="topbar-right">
            <span className="live-indicator">
              <i /> LIVE
            </span>
            <span className="version-label">v0.2.0</span>
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
