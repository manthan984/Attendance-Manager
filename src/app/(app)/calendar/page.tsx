"use client";

import { useState, useEffect, useTransition } from "react";
import { getMonthRecords, type MonthRecord } from "@/app/actions/attendance";
import { getSubjects, type SubjectWithStats } from "@/app/actions/subjects";
import AttendanceForm from "@/components/subjects/AttendanceForm";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [records, setRecords] = useState<MonthRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithStats | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const [recordsData, subjectsData] = await Promise.all([
        getMonthRecords(year, month),
        getSubjects(),
      ]);
      setRecords(recordsData);
      setSubjects(subjectsData);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const filteredRecords = filter
    ? records.filter((r) => r.subjectId === filter)
    : records;

  // Group records by date
  const recordsByDate: Record<string, MonthRecord[]> = {};
  filteredRecords.forEach((r) => {
    if (!recordsByDate[r.date]) recordsByDate[r.date] = [];
    recordsByDate[r.date].push(r);
  });

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);

    if (subjects.length === 1) {
      setSelectedSubject(subjects[0]);
      setShowForm(true);
    } else if (subjects.length > 1) {
      // Show subject selector
      setShowForm(true);
      setSelectedSubject(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <p className="page-subtitle">
          Visual overview of your attendance across all subjects
        </p>
      </div>

      {/* Subject Filter */}
      {subjects.length > 0 && (
        <div className="filter-chips">
          <button
            className={`filter-chip ${!filter ? "active" : ""}`}
            onClick={() => setFilter(null)}
          >
            All Subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              className={`filter-chip ${filter === s.id ? "active" : ""}`}
              onClick={() => setFilter(filter === s.id ? null : s.id)}
            >
              <span
                className="filter-chip-dot"
                style={{ background: s.color }}
              />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Calendar Header */}
      <div className="calendar-header">
        <div className="calendar-nav">
          <button
            className="btn btn-ghost btn-icon"
            onClick={goToPreviousMonth}
          >
            ‹
          </button>
          <span className="calendar-month-label">
            {MONTHS[month]} {year}
          </span>
          <button className="btn btn-ghost btn-icon" onClick={goToNextMonth}>
            ›
          </button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={goToToday}>
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        {DAYS.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* Previous month days */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div
            key={`prev-${i}`}
            className="calendar-day other-month"
          >
            <div className="calendar-day-number">
              {prevMonthDays - firstDay + 1 + i}
            </div>
          </div>
        ))}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayRecords = recordsByDate[dateStr] || [];
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? "today" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <div className="calendar-day-number">
                {isToday ? (
                  <span>{day}</span>
                ) : (
                  day
                )}
              </div>
              <div className="calendar-day-dots">
                {dayRecords.map((r) => {
                  const dotClass =
                    r.attended === r.totalClasses
                      ? "attended"
                      : r.attended === 0
                      ? "missed"
                      : "partial";
                  return (
                    <div
                      key={r.id}
                      className={`calendar-dot ${dotClass}`}
                      style={{
                        backgroundColor: r.subjectColor,
                        color: r.subjectColor,
                      }}
                      title={`${r.subjectName}: ${r.attended}/${r.totalClasses}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Next month days to fill grid */}
        {Array.from(
          { length: (7 - ((firstDay + daysInMonth) % 7)) % 7 },
          (_, i) => (
            <div
              key={`next-${i}`}
              className="calendar-day other-month"
            >
              <div className="calendar-day-number">{i + 1}</div>
            </div>
          )
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "16px",
          justifyContent: "center",
          fontSize: "13px",
          color: "var(--muted-text)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--vibrant-amethyst)",
            }}
          />
          Attended
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--vibrant-amethyst)",
              opacity: 0.7,
            }}
          />
          Partial
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              border: "1.5px solid var(--vibrant-amethyst)",
              background: "transparent",
            }}
          />
          Missed
        </span>
      </div>

      {/* Subject Picker / Attendance Form */}
      {showForm && selectedDate && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setSelectedSubject(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {!selectedSubject ? (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">Add Attendance for {selectedDate}</h2>
                  <button
                    className="modal-close"
                    onClick={() => { setShowForm(false); setSelectedSubject(null); }}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <p style={{ fontSize: "14px", color: "var(--muted-text)" }}>
                    Select a subject:
                  </p>
                  {subjects.length === 0 ? (
                    <p style={{ fontSize: "14px", color: "var(--muted-text)" }}>
                      No subjects yet. Add subjects first from the Subjects page.
                    </p>
                  ) : (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {subjects.map((s) => (
                        <button
                          key={s.id}
                          className="btn btn-secondary"
                          style={{
                            justifyContent: "flex-start",
                            borderLeft: `4px solid ${s.color}`,
                          }}
                          onClick={() => setSelectedSubject(s)}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Close this modal and show AttendanceForm
              (() => {
                // Trick: we render AttendanceForm directly
                return null;
              })()
            )}
          </div>
        </div>
      )}

      {showForm && selectedSubject && selectedDate && (
        <AttendanceForm
          subjectId={selectedSubject.id}
          subjectName={selectedSubject.name}
          subjectColor={selectedSubject.color}
          initialDate={selectedDate}
          onClose={() => {
            setShowForm(false);
            setSelectedSubject(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
