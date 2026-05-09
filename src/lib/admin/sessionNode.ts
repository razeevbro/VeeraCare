import crypto from "node:crypto";
import { ADMIN_SESSION_COOKIE } from "./session";

type JwtPayload = {
  sub: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
};

function base64UrlEncode(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

export function signAdminSession(args: {
  email: string;
  ttlSeconds: number;
  secret: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    sub: "admin",
    email: args.email,
    role: "admin",
    iat: now,
    exp: now + args.ttlSeconds,
  };

  const headerB64 = base64UrlEncode(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const msg = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac("sha256", args.secret).update(msg).digest();
  const sigB64 = base64UrlEncode(sig);
  return `${msg}.${sigB64}`;
}

export function verifyAdminSession(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const msg = `${h}.${p}`;
  const expected = crypto.createHmac("sha256", secret).update(msg).digest();
  const given = base64UrlDecode(s);
  if (given.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(given, expected)) return null;

  try {
    const payloadJson = base64UrlDecode(p).toString("utf8");
    const payload = JSON.parse(payloadJson) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== "admin") return null;
    if (payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export { ADMIN_SESSION_COOKIE };

