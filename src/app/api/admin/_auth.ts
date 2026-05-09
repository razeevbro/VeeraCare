import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/sessionNode";

export function assertAdmin(req: NextRequest) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  return Boolean(verifyAdminSession(token, secret));
}

