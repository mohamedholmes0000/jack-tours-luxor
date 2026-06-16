import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";

type ProfilePayload = {
  name?: unknown;
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

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

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
  const currentPassword = cleanText(payload.currentPassword);
  const newPassword = cleanText(payload.newPassword);
  const confirmPassword = cleanText(payload.confirmPassword);
  const data: { name?: string; password?: string } = {};

  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, message: "Name must be at least 2 characters." }, { status: 400 });
  }

  data.name = name;

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

  return NextResponse.json({ ok: true, user: updatedUser });
}
