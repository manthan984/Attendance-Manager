"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Helpers ─────────────────────────────────────────────────────

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}

// ─── Verify subject belongs to user ─────────────────────────────

async function verifySubjectOwnership(subjectId: string) {
  const userId = await getAuthUserId();
  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
  });
  if (!subject) {
    throw new Error("Subject not found or access denied");
  }
  return { userId, subject };
}

// ─── Types ───────────────────────────────────────────────────────

export type MonthRecord = {
  id: string;
  date: string;
  totalClasses: number;
  attended: number;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
};

// ─── CRUD ────────────────────────────────────────────────────────

export async function addAttendanceRecord(formData: FormData) {
  const subjectId = formData.get("subjectId") as string;
  const dateStr = formData.get("date") as string;
  const totalClasses = parseInt(
    (formData.get("totalClasses") as string) || "1",
    10
  );
  const attended = parseInt(
    (formData.get("attended") as string) || "0",
    10
  );

  if (!subjectId || !dateStr) {
    return { error: "Subject and date are required" };
  }

  if (attended > totalClasses) {
    return { error: "Attended classes cannot exceed total classes" };
  }

  if (totalClasses < 1) {
    return { error: "Total classes must be at least 1" };
  }

  await verifySubjectOwnership(subjectId);

  const date = new Date(dateStr + "T00:00:00.000Z");

  try {
    await prisma.attendanceRecord.upsert({
      where: {
        subjectId_date: {
          subjectId,
          date,
        },
      },
      update: {
        totalClasses,
        attended,
      },
      create: {
        date,
        totalClasses,
        attended,
        subjectId,
      },
    });
  } catch {
    return { error: "Failed to save attendance record" };
  }

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${subjectId}`);
  return { success: true };
}

export async function updateAttendanceRecord(
  recordId: string,
  formData: FormData
) {
  const totalClasses = parseInt(
    (formData.get("totalClasses") as string) || "1",
    10
  );
  const attended = parseInt(
    (formData.get("attended") as string) || "0",
    10
  );

  if (attended > totalClasses) {
    return { error: "Attended classes cannot exceed total classes" };
  }

  const userId = await getAuthUserId();

  const record = await prisma.attendanceRecord.findFirst({
    where: {
      id: recordId,
      subject: { userId },
    },
  });

  if (!record) {
    return { error: "Record not found" };
  }

  await prisma.attendanceRecord.update({
    where: { id: recordId },
    data: { totalClasses, attended },
  });

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${record.subjectId}`);
  return { success: true };
}

export async function deleteAttendanceRecord(recordId: string) {
  const userId = await getAuthUserId();

  const record = await prisma.attendanceRecord.findFirst({
    where: {
      id: recordId,
      subject: { userId },
    },
  });

  if (!record) {
    return { error: "Record not found" };
  }

  await prisma.attendanceRecord.delete({
    where: { id: recordId },
  });

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath(`/subjects/${record.subjectId}`);
  return { success: true };
}

export async function getMonthRecords(
  year: number,
  month: number
): Promise<MonthRecord[]> {
  const userId = await getAuthUserId();

  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  const records = await prisma.attendanceRecord.findMany({
    where: {
      subject: { userId },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      subject: {
        select: { name: true, color: true },
      },
    },
    orderBy: { date: "asc" },
  });

  return records.map((r) => ({
    id: r.id,
    date: r.date.toISOString().split("T")[0],
    totalClasses: r.totalClasses,
    attended: r.attended,
    subjectId: r.subjectId,
    subjectName: r.subject.name,
    subjectColor: r.subject.color,
  }));
}
