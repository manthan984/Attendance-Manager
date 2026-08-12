import Link from "next/link";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="landing-nav-brand">
          <div className="sidebar-logo">A</div>
          AttendTrack
        </Link>
        <div>
          {session ? (
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard →
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Get Started →
            </Link>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-badge">✨ Smart Attendance Tracking</div>
        <h1 className="landing-title">
          Never Lose Track of Your{" "}
          <span className="highlight">Attendance</span> Again
        </h1>
        <p className="landing-desc">
          A beautiful, modern tool to track your class attendance across all
          subjects. Set custom danger thresholds, visualize your progress on a
          calendar, and stay on top of your academic game.
        </p>
        <div className="landing-cta">
          <Link
            href={session ? "/dashboard" : "/login"}
            className="btn btn-primary btn-lg"
          >
            {session ? "Go to Dashboard" : "Start Tracking Free"} →
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            See Features
          </a>
        </div>
      </section>

      <section id="features" className="landing-features">
        <div className="feature-card" style={{ animationDelay: "0.1s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--faint-lavender)",
              color: "var(--vibrant-amethyst)",
            }}
          >
            📊
          </div>
          <h3 className="feature-title">Smart Dashboard</h3>
          <p className="feature-desc">
            Get a bird&apos;s-eye view of all your subjects with real-time
            attendance percentages and visual progress rings.
          </p>
        </div>

        <div className="feature-card" style={{ animationDelay: "0.2s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--mint-pale)",
              color: "var(--mint-green)",
            }}
          >
            📅
          </div>
          <h3 className="feature-title">Calendar View</h3>
          <p className="feature-desc">
            See your attendance on a monthly calendar grid with color-coded dots
            showing which classes you attended or missed.
          </p>
        </div>

        <div className="feature-card" style={{ animationDelay: "0.3s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--danger-red-light)",
              color: "var(--danger-red)",
            }}
          >
            🚨
          </div>
          <h3 className="feature-title">Danger Zone Alerts</h3>
          <p className="feature-desc">
            Set custom attendance thresholds per subject. Get instant warnings
            when your attendance drops below the danger zone.
          </p>
        </div>

        <div className="feature-card" style={{ animationDelay: "0.4s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--warm-amber-light)",
              color: "var(--warm-amber)",
            }}
          >
            🔒
          </div>
          <h3 className="feature-title">Secure & Private</h3>
          <p className="feature-desc">
            Sign in with Google or GitHub. Your data is private, encrypted, and
            only visible to you. No sharing, no snooping.
          </p>
        </div>

        <div className="feature-card" style={{ animationDelay: "0.5s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--faint-lavender)",
              color: "var(--vibrant-amethyst)",
            }}
          >
            🎨
          </div>
          <h3 className="feature-title">Beautiful Design</h3>
          <p className="feature-desc">
            A stunning Amethyst-Mint design with glassmorphism effects, smooth
            animations, and dark mode support.
          </p>
        </div>

        <div className="feature-card" style={{ animationDelay: "0.6s" }}>
          <div
            className="feature-icon"
            style={{
              background: "var(--mint-pale)",
              color: "var(--mint-green)",
            }}
          >
            📱
          </div>
          <h3 className="feature-title">Works Everywhere</h3>
          <p className="feature-desc">
            Fully responsive design that works beautifully on your phone,
            tablet, and desktop. Track attendance on the go.
          </p>
        </div>
      </section>
    </div>
  );
}
