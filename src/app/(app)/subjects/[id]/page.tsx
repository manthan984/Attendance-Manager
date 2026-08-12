"use client";

import { useState, useEffect, useTransition } from "react";
import { getSubjectById } from "@/app/actions/subjects";
import {
  deleteAttendanceRecord,
  updateAttendanceRecord,
} from "@/app/actions/attendance";
import AttendanceForm from "@/components/subjects/AttendanceForm";
import Link from "next/link";
import { useParams } from "next/navigation";

type SubjectDetail = Awaited<ReturnType<typeof getSubjectById>>;

export default function SubjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState(1);
  const [editAttended, setEditAttended] = useState(0);

  const loadSubject = () => {
    startTransition(async () => {
      try {
        const data = await getSubjectById(id);
        setSubject(data);
      } catch {
        setSubject(null);
      }
    });
  };

  useEffect(() => {
    loadSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!subject && isPending) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon" style={{ animation: "pulse 1.5s infinite" }}>⏳</div>
          <h3 className="empty-state-title">Loading...</h3>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">Subject not found</h3>
          <Link href="/subjects" className="btn btn-primary">
            ← Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const status =
    subject.attendancePercentage < subject.dangerThreshold
      ? "danger"
      : subject.attendancePercentage < subject.dangerThreshold + 10
      ? "warning"
      : "safe";

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: "8px" }}>
        <Link href="/subjects" className="btn btn-ghost btn-sm" style={{ marginLeft: "-8px" }}>
          ← Back to Subjects
        </Link>
      </div>

      <div className="subject-detail-header">
        <div
          className="subject-detail-color"
          style={{ background: subject.color }}
        />
        <div className="subject-detail-info">
          <h1 className="subject-detail-name">{subject.name}</h1>
          <div className="subject-detail-meta">
            <span>
              🎯 Danger below {subject.dangerThreshold}%
            </span>
            <span>
              📊{" "}
              {subject.totalClasses > 0
                ? `${subject.attendancePercentage.toFixed(1)}% attendance`
                : "No records yet"}
            </span>
            <span>
              📝 {subject.totalAttended}/{subject.totalClasses} classes
            </span>
          </div>
        </div>

        <div className="progress-ring-container">
          <svg className="progress-ring" width="80" height="80">
            <circle className="progress-ring-bg" cx="40" cy="40" r="32" />
            <circle
              className="progress-ring-fill"
              cx="40"
              cy="40"
              r="32"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${
                2 * Math.PI * 32 * (1 - subject.attendancePercentage / 100)
              }`}
              stroke={
                status === "danger"
                  ? "var(--danger-red)"
                  : status === "warning"
                  ? "var(--warm-amber)"
                  : "var(--mint-green)"
              }
            />
          </svg>
          <span className="progress-ring-text" style={{ fontSize: "16px" }}>
            {subject.totalClasses > 0
              ? `${Math.round(subject.attendancePercentage)}%`
              : "—"}
          </span>
        </div>
      </div>

      {/* Danger alert */}
      {status === "danger" && (
        <div className="danger-alert">
          <span className="danger-alert-icon">🚨</span>
          <div className="danger-alert-text">
            <div className="danger-alert-title">Below Danger Threshold!</div>
            <div className="danger-alert-desc">
              Your attendance ({subject.attendancePercentage.toFixed(1)}%) is
              below your danger threshold of {subject.dangerThreshold}%.
            </div>
          </div>
        </div>
      )}

      {/* Add Record Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 700 }}>
          Attendance Records
        </h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(true)}
        >
          + Add Record
        </button>
      </div>

      {/* Records Table */}
      {subject.records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No records yet</h3>
          <p className="empty-state-desc">
            Start adding attendance records for this subject.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add First Record
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Classes</th>
              <th>Attended</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subject.records.map((record) => {
              const dateStr = new Date(record.date).toLocaleDateString(
                "en-IN",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );
              const isEditing = editingRecord === record.id;
              const recordStatus =
                record.attended === record.totalClasses
                  ? "full"
                  : record.attended === 0
                  ? "missed"
                  : "partial";

              return (
                <tr key={record.id}>
                  <td style={{ fontWeight: 500 }}>{dateStr}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="form-input"
                        type="number"
                        min="1"
                        max="20"
                        value={editTotal}
                        onChange={(e) => setEditTotal(parseInt(e.target.value) || 1)}
                        style={{ width: "70px", padding: "4px 8px" }}
                      />
                    ) : (
                      record.totalClasses
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        max={editTotal}
                        value={editAttended}
                        onChange={(e) =>
                          setEditAttended(
                            Math.min(parseInt(e.target.value) || 0, editTotal)
                          )
                        }
                        style={{ width: "70px", padding: "4px 8px" }}
                      />
                    ) : (
                      record.attended
                    )}
                  </td>
                  <td>
                    {!isEditing && (
                      <span className={`attendance-badge ${recordStatus}`}>
                        {recordStatus === "full"
                          ? "✓ Present"
                          : recordStatus === "missed"
                          ? "✗ Absent"
                          : `${record.attended}/${record.totalClasses}`}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            const formData = new FormData();
                            formData.set("totalClasses", editTotal.toString());
                            formData.set("attended", editAttended.toString());
                            startTransition(async () => {
                              await updateAttendanceRecord(record.id, formData);
                              setEditingRecord(null);
                              loadSubject();
                            });
                          }}
                          disabled={isPending}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingRecord(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setEditingRecord(record.id);
                            setEditTotal(record.totalClasses);
                            setEditAttended(record.attended);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            if (confirm("Delete this record?")) {
                              startTransition(async () => {
                                await deleteAttendanceRecord(record.id);
                                loadSubject();
                              });
                            }
                          }}
                          disabled={isPending}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showForm && (
        <AttendanceForm
          subjectId={subject.id}
          subjectName={subject.name}
          subjectColor={subject.color}
          onClose={() => {
            setShowForm(false);
            loadSubject();
          }}
        />
      )}
    </div>
  );
}
