import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin/sessionNode";

const DEFAULT_ADMIN_EMAIL = "admin@veeracare.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

export async function POST(req: NextRequest) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = (await req.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const adminEmail = (process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminSession({
    email,
    ttlSeconds: 60 * 60 * 8,
    secret,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

