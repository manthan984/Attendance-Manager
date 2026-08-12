"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/calendar", icon: "📅", label: "Calendar" },
  { href: "/subjects", icon: "📚", label: "Subjects" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">A</div>
          <div>
            <div className="sidebar-brand">Classroom</div>
            <div className="sidebar-brand-sub">Attendance Manager</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${
                pathname.startsWith(item.href) ? "active" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-link" style={{ fontSize: "13px" }}>
            <span className="sidebar-link-icon">🏠</span>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 140,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Expose toggle for Navbar */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        id="mobile-menu-toggle"
        style={{ display: "none" }}
        data-sidebar-toggle
      >
        ☰
      </button>
    </>
  );
}
