"use client";

import { useState, useTransition } from "react";
import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/app/actions/subjects";
import type { SubjectWithStats } from "@/app/actions/subjects";

const SUBJECT_COLORS = [
  "#8D59C6",
  "#5B2A86",
  "#3ED4A7",
  "#E55353",
  "#F5A623",
  "#4A90D9",
  "#E84393",
  "#00B894",
  "#6C5CE7",
  "#FD79A8",
  "#00CEC9",
  "#A29BFE",
];

interface SubjectFormProps {
  subject?: SubjectWithStats;
  onClose: () => void;
}

export default function SubjectForm({ subject, onClose }: SubjectFormProps) {
  const [name, setName] = useState(subject?.name || "");
  const [threshold, setThreshold] = useState(subject?.dangerThreshold || 75);
  const [color, setColor] = useState(subject?.color || SUBJECT_COLORS[0]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("dangerThreshold", threshold.toString());
    formData.set("color", color);

    startTransition(async () => {
      const result = subject
        ? await updateSubject(subject.id, formData)
        : await createSubject(formData);

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
          <h2 className="modal-title">
            {subject ? "Edit Subject" : "Add Subject"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="subject-name">
                Subject Name
              </label>
              <input
                id="subject-name"
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mathematics, Physics..."
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject Color</label>
              <div className="color-grid">
                {SUBJECT_COLORS.map((c) => (
                  <div
                    key={c}
                    className={`color-swatch ${color === c ? "selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="danger-threshold">
                Danger Threshold: {threshold}%
              </label>
              <input
                id="danger-threshold"
                className="range-slider"
                type="range"
                min="0"
                max="100"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--muted-text)",
                }}
              >
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="form-hint">
                You&apos;ll get a warning when attendance drops below {threshold}%.
              </p>
            </div>

            {/* Preview */}
            <div
              className="card"
              style={{
                borderLeft: `4px solid ${color}`,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--muted-text)" }}>
                Preview
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "var(--dark-text)",
                }}
              >
                {name || "Subject Name"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted-text)" }}>
                Danger below {threshold}%
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="modal-footer">
            {subject && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                style={{ marginRight: "auto" }}
                onClick={() => {
                  if (confirm("Delete this subject and all its records?")) {
                    startTransition(async () => {
                      await deleteSubject(subject.id);
                      onClose();
                    });
                  }
                }}
                disabled={isPending}
              >
                Delete
              </button>
            )}
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
              {isPending
                ? "Saving..."
                : subject
                ? "Save Changes"
                : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
