"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleSidebar = () => {
    const btn = document.querySelector(
      "[data-sidebar-toggle]"
    ) as HTMLButtonElement;
    btn?.click();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <div className="navbar-right">
        {session?.user && (
          <div className="user-menu" ref={menuRef}>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={36}
                height={36}
                className="user-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            ) : (
              <div
                className="user-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--faint-lavender)",
                  color: "var(--vibrant-amethyst)",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}

            {menuOpen && (
              <div className="user-menu-dropdown">
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "var(--dark-text)",
                    }}
                  >
                    {session.user.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted-text)" }}>
                    {session.user.email}
                  </div>
                </div>
                <button
                  className="user-menu-item danger"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
