"use client";

import { useState, useEffect, useTransition } from "react";
import { getSubjects, type SubjectWithStats } from "@/app/actions/subjects";
import SubjectForm from "@/components/subjects/SubjectForm";
import Link from "next/link";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editSubject, setEditSubject] = useState<SubjectWithStats | undefined>();
  const [isPending, startTransition] = useTransition();

  const loadSubjects = () => {
    startTransition(async () => {
      const data = await getSubjects();
      setSubjects(data);
    });
  };

  useEffect(() => {
    loadSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setShowForm(false);
    setEditSubject(undefined);
    loadSubjects();
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Subjects</h1>
          <p className="page-subtitle">
            Manage your subjects and set attendance thresholds
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditSubject(undefined);
            setShowForm(true);
          }}
        >
          + Add Subject
        </button>
      </div>

      {isPending && subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ animation: "pulse 1.5s infinite" }}>⏳</div>
          <h3 className="empty-state-title">Loading...</h3>
        </div>
      ) : subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No subjects yet</h3>
          <p className="empty-state-desc">
            Add your subjects to start tracking attendance. Each subject can have
            its own danger threshold.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Your First Subject
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {subjects.map((subject, index) => (
            <div
              key={subject.id}
              className={`subject-card ${subject.status === "danger" ? "danger" : ""}`}
              style={{ animationDelay: `${index * 0.05}s`, cursor: "default" }}
            >
              <div
                className="subject-card-color"
                style={{ background: subject.color }}
              />
              <Link
                href={`/subjects/${subject.id}`}
                className="subject-card-info"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="subject-card-name">{subject.name}</div>
                <div className="subject-card-stats">
                  <span>
                    {subject.totalAttended}/{subject.totalClasses} classes
                  </span>
                  <span>•</span>
                  <span>
                    {subject.totalClasses > 0
                      ? `${subject.attendancePercentage.toFixed(1)}%`
                      : "No records"}
                  </span>
                </div>
                <div className="subject-card-threshold">
                  🎯 Danger below {subject.dangerThreshold}%
                </div>
              </Link>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div className="progress-ring-container">
                  <svg className="progress-ring" width="56" height="56">
                    <circle className="progress-ring-bg" cx="28" cy="28" r="22" />
                    <circle
                      className="progress-ring-fill"
                      cx="28"
                      cy="28"
                      r="22"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 22 * (1 - subject.attendancePercentage / 100)
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
                  <span className="progress-ring-text" style={{ fontSize: "11px" }}>
                    {subject.totalClasses > 0
                      ? `${Math.round(subject.attendancePercentage)}%`
                      : "—"}
                  </span>
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditSubject(subject);
                    setShowForm(true);
                  }}
                  title="Edit subject"
                >
                  ✏️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <SubjectForm subject={editSubject} onClose={handleClose} />}
    </div>
  );
}
