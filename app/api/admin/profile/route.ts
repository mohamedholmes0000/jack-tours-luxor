import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";

type ProfilePayload = {
  name?: unknown;
  email?: unknown;
  emailCurrentPassword?: unknown;
  currentPassword?: unknown;
  newPassword?: unknown;
  confirmPassword?: unknown;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function passwordIsStrongEnough(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function emailIsValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentAdminUser();
  const email = currentUser?.email.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Profile was not saved." },
      { status: 503 },
    );
  }

  const payload = (await request.json().catch(() => null)) as ProfilePayload | null;
  if (!payload) {
    return NextResponse.json({ ok: false, message: "Invalid profile data." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Profile changes require a database admin user." },
      { status: 404 },
    );
  }

  const name = cleanText(payload.name);
  const nextEmail = cleanText(payload.email).toLowerCase();
  const emailCurrentPassword = cleanText(payload.emailCurrentPassword);
  const currentPassword = cleanText(payload.currentPassword);
  const newPassword = cleanText(payload.newPassword);
  const confirmPassword = cleanText(payload.confirmPassword);
  const data: { name?: string; email?: string; password?: string } = {};

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, message: "Name must be at least 2 characters." }, { status: 400 });
  }

  data.name = name;

  if (nextEmail && nextEmail !== user.email) {
    if (!emailIsValid(nextEmail)) {
      return NextResponse.json({ ok: false, message: "Add a valid email address." }, { status: 400 });
    }

    if (!emailCurrentPassword) {
      return NextResponse.json(
        { ok: false, message: "Current password is required to change email." },
        { status: 400 },
      );
    }

    const emailPasswordMatches = await bcrypt.compare(emailCurrentPassword, user.password);
    if (!emailPasswordMatches) {
      return NextResponse.json({ ok: false, message: "Current password is incorrect." }, { status: 400 });
    }

    const existingEmailUser = await prisma.adminUser.findUnique({ where: { email: nextEmail } });
    if (existingEmailUser && existingEmailUser.id !== user.id) {
      return NextResponse.json({ ok: false, message: "This email is already used by another admin user." }, { status: 409 });
    }

    data.email = nextEmail;
  }

  if (newPassword || confirmPassword || currentPassword) {
    if (!currentPassword) {
      return NextResponse.json({ ok: false, message: "Current password is required." }, { status: 400 });
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!currentPasswordMatches) {
      return NextResponse.json({ ok: false, message: "Current password is incorrect." }, { status: 400 });
    }

    if (!passwordIsStrongEnough(newPassword)) {
      return NextResponse.json(
        { ok: false, message: "New password must be at least 8 characters and include letters and numbers." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ ok: false, message: "New password confirmation does not match." }, { status: 400 });
    }

    data.password = await bcrypt.hash(newPassword, 12);
  }

  const updatedUser = await prisma.adminUser.update({
    where: { id: user.id },
    data,
    select: { email: true, name: true },
  });

  return NextResponse.json({ ok: true, user: updatedUser, emailChanged: Boolean(data.email) });
}
