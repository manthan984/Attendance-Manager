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

// ─── Types ───────────────────────────────────────────────────────

export type SubjectWithStats = {
  id: string;
  name: string;
  color: string;
  dangerThreshold: number;
  totalClasses: number;
  totalAttended: number;
  attendancePercentage: number;
  status: "safe" | "warning" | "danger";
  recordCount: number;
};

// ─── CRUD ────────────────────────────────────────────────────────

export async function getSubjects(): Promise<SubjectWithStats[]> {
  const userId = await getAuthUserId();

  const subjects = await prisma.subject.findMany({
    where: { userId },
    include: {
      records: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return subjects.map((subject) => {
    const totalClasses = subject.records.reduce(
      (sum, r) => sum + r.totalClasses,
      0
    );
    const totalAttended = subject.records.reduce(
      (sum, r) => sum + r.attended,
      0
    );
    const attendancePercentage =
      totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

    let status: "safe" | "warning" | "danger" = "safe";
    if (attendancePercentage < subject.dangerThreshold) {
      status = "danger";
    } else if (attendancePercentage < subject.dangerThreshold + 10) {
      status = "warning";
    }

    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      dangerThreshold: subject.dangerThreshold,
      totalClasses,
      totalAttended,
      attendancePercentage,
      status,
      recordCount: subject.records.length,
    };
  });
}

export async function getSubjectById(subjectId: string) {
  const userId = await getAuthUserId();

  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
    include: {
      records: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const totalClasses = subject.records.reduce(
    (sum, r) => sum + r.totalClasses,
    0
  );
  const totalAttended = subject.records.reduce(
    (sum, r) => sum + r.attended,
    0
  );
  const attendancePercentage =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

  return {
    ...subject,
    totalClasses,
    totalAttended,
    attendancePercentage,
  };
}

export async function createSubject(formData: FormData) {
  const userId = await getAuthUserId();

  const name = formData.get("name") as string;
  const dangerThreshold = parseFloat(
    (formData.get("dangerThreshold") as string) || "75"
  );
  const color = (formData.get("color") as string) || "#8D59C6";

  if (!name || name.trim().length === 0) {
    return { error: "Subject name is required" };
  }

  try {
    await prisma.subject.create({
      data: {
        name: name.trim(),
        dangerThreshold,
        color,
        userId,
      },
    });
  } catch {
    return { error: "A subject with this name already exists" };
  }

  revalidatePath("/subjects");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return { success: true };
}

export async function updateSubject(subjectId: string, formData: FormData) {
  const userId = await getAuthUserId();

  const name = formData.get("name") as string;
  const dangerThreshold = parseFloat(
    (formData.get("dangerThreshold") as string) || "75"
  );
  const color = (formData.get("color") as string) || "#8D59C6";

  if (!name || name.trim().length === 0) {
    return { error: "Subject name is required" };
  }

  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
  });

  if (!subject) {
    return { error: "Subject not found" };
  }

  try {
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        name: name.trim(),
        dangerThreshold,
        color,
      },
    });
  } catch {
    return { error: "A subject with this name already exists" };
  }

  revalidatePath("/subjects");
  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return { success: true };
}

export async function deleteSubject(subjectId: string) {
  const userId = await getAuthUserId();

  const subject = await prisma.subject.findFirst({
    where: { id: subjectId, userId },
  });

  if (!subject) {
    return { error: "Subject not found" };
  }

  await prisma.subject.delete({
    where: { id: subjectId },
  });

  revalidatePath("/subjects");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return { success: true };
}
