"use client";

import { useState, useTransition } from "react";
import { addAttendanceRecord } from "@/app/actions/attendance";

interface AttendanceFormProps {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  initialDate?: string;
  onClose: () => void;
}

export default function AttendanceForm({
  subjectId,
  subjectName,
  subjectColor,
  initialDate,
  onClose,
}: AttendanceFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(initialDate || today);
  const [totalClasses, setTotalClasses] = useState(1);
  const [attended, setAttended] = useState(1);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.set("subjectId", subjectId);
    formData.set("date", date);
    formData.set("totalClasses", totalClasses.toString());
    formData.set("attended", attended.toString());

    startTransition(async () => {
      const result = await addAttendanceRecord(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Attendance</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Subject indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: "var(--faint-lavender)",
                borderRadius: "var(--radius-md)",
                borderLeft: `4px solid ${subjectColor}`,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {subjectName}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="attendance-date">
                Date
              </label>
              <input
                id="attendance-date"
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="total-classes">
                  Total Classes
                </label>
                <input
                  id="total-classes"
                  className="form-input"
                  type="number"
                  min="1"
                  max="20"
                  value={totalClasses}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setTotalClasses(val);
                    if (attended > val) setAttended(val);
                  }}
                  required
                />
                <p className="form-hint">How many happened</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="attended-classes">
                  Attended
                </label>
                <input
                  id="attended-classes"
                  className="form-input"
                  type="number"
                  min="0"
                  max={totalClasses}
                  value={attended}
                  onChange={(e) =>
                    setAttended(Math.min(parseInt(e.target.value) || 0, totalClasses))
                  }
                  required
                />
                <p className="form-hint">How many you attended</p>
              </div>
            </div>

            {/* Quick toggle for simple present/absent */}
            {totalClasses === 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className={`btn btn-sm ${attended === 1 ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setAttended(1)}
                  style={{ flex: 1 }}
                >
                  ✅ Present
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${attended === 0 ? "btn-danger" : "btn-secondary"}`}
                  onClick={() => setAttended(0)}
                  style={{ flex: 1 }}
                >
                  ❌ Absent
                </button>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
