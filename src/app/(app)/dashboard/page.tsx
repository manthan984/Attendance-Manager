import { getSubjects } from "@/app/actions/subjects";
import Link from "next/link";

export default async function DashboardPage() {
  const subjects = await getSubjects();

  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.totalAttended, 0);
  const overallPercentage =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;
  const dangerSubjects = subjects.filter((s) => s.status === "danger");
  const warningSubjects = subjects.filter((s) => s.status === "warning");

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Your attendance overview at a glance
        </p>
      </div>

      {/* Danger Alerts */}
      {dangerSubjects.length > 0 && (
        <div className="danger-alert">
          <span className="danger-alert-icon">🚨</span>
          <div className="danger-alert-text">
            <div className="danger-alert-title">
              Attendance Below Danger Threshold!
            </div>
            <div className="danger-alert-desc">
              {dangerSubjects.map((s) => s.name).join(", ")}{" "}
              {dangerSubjects.length === 1 ? "is" : "are"} below your set danger
              threshold. Attend more classes to improve!
            </div>
          </div>
        </div>
      )}

      {warningSubjects.length > 0 && (
        <div
          className="danger-alert"
          style={{
            background:
              "linear-gradient(135deg, var(--warm-amber-light), #FFF8E7)",
            borderColor: "var(--warm-amber)",
            animation: "fadeInUp 0.4s ease",
          }}
        >
          <span className="danger-alert-icon">⚠️</span>
          <div className="danger-alert-text">
            <div className="danger-alert-title" style={{ color: "var(--warm-amber)" }}>
              Approaching Danger Zone
            </div>
            <div className="danger-alert-desc">
              {warningSubjects.map((s) => s.name).join(", ")}{" "}
              {warningSubjects.length === 1 ? "is" : "are"} within 10% of your
              danger threshold. Stay alert!
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ animationDelay: "0.05s" }}>
          <div className="stat-icon purple">📚</div>
          <div className="stat-info">
            <div className="stat-value">{subjects.length}</div>
            <div className="stat-label">Total Subjects</div>
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: "0.1s" }}>
          <div className="stat-icon mint">✅</div>
          <div className="stat-info">
            <div className="stat-value">
              {totalClasses > 0
                ? `${overallPercentage.toFixed(1)}%`
                : "—"}
            </div>
            <div className="stat-label">Overall Attendance</div>
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: "0.15s" }}>
          <div className="stat-icon amber">📝</div>
          <div className="stat-info">
            <div className="stat-value">
              {totalAttended}/{totalClasses}
            </div>
            <div className="stat-label">Classes Attended</div>
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: "0.2s" }}>
          <div className="stat-icon red">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{dangerSubjects.length}</div>
            <div className="stat-label">Subjects at Risk</div>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No subjects yet</h3>
          <p className="empty-state-desc">
            Add your first subject to start tracking attendance. You&apos;re just
            one click away!
          </p>
          <Link href="/subjects" className="btn btn-primary">
            + Add Your First Subject
          </Link>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Your Subjects</h2>
            <Link href="/subjects" className="btn btn-sm btn-secondary">
              Manage →
            </Link>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {subjects.map((subject, index) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className={`subject-card ${
                  subject.status === "danger" ? "danger" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="subject-card-color"
                  style={{ background: subject.color }}
                />

                <div className="subject-card-info">
                  <div className="subject-card-name">{subject.name}</div>
                  <div className="subject-card-stats">
                    <span>
                      {subject.totalAttended}/{subject.totalClasses} classes
                    </span>
                    <span>•</span>
                    <span>{subject.recordCount} days recorded</span>
                  </div>
                  <div className="subject-card-threshold">
                    🎯 Danger below {subject.dangerThreshold}%
                  </div>
                </div>

                <div className="progress-ring-container">
                  <svg className="progress-ring" width="64" height="64">
                    <circle
                      className="progress-ring-bg"
                      cx="32"
                      cy="32"
                      r="26"
                    />
                    <circle
                      className="progress-ring-fill"
                      cx="32"
                      cy="32"
                      r="26"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 26 * (1 - subject.attendancePercentage / 100)
                      }`}
                      stroke={
                        subject.status === "danger"
                          ? "var(--danger-red)"
                          : subject.status === "warning"
                          ? "var(--warm-amber)"
                          : "var(--mint-green)"
                      }
                    />
                  </svg>
                  <span
                    className="progress-ring-text"
                    style={{ fontSize: "13px" }}
                  >
                    {subject.totalClasses > 0
                      ? `${Math.round(subject.attendancePercentage)}%`
                      : "—"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
