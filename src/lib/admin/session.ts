export const ADMIN_SESSION_COOKIE = "veeracare_admin_session";

type JwtPayload = {
  sub: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
};

function base64UrlEncode(bytes: Uint8Array) {
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeToBytes(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function utf8(s: string) {
  return new TextEncoder().encode(s);
}

async function hmacSha256(key: string, data: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    utf8(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, utf8(data));
  return new Uint8Array(sig);
}

export async function signAdminSessionEdge(args: {
  email: string;
  ttlSeconds: number;
  secret: string;
}) {
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: "admin",
    email: args.email,
    role: "admin",
    iat: now,
    exp: now + args.ttlSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64UrlEncode(utf8(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(utf8(JSON.stringify(payload)));
  const msg = `${headerB64}.${payloadB64}`;
  const sig = await hmacSha256(args.secret, msg);
  const sigB64 = base64UrlEncode(sig);
  return `${msg}.${sigB64}`;
}

export async function verifyAdminSessionEdge(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const msg = `${h}.${p}`;
  const expected = await hmacSha256(secret, msg);
  const given = base64UrlDecodeToBytes(s);
  if (given.length !== expected.length) return null;
  // Constant-time compare
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given[i] ^ expected[i];
  if (diff !== 0) return null;

  try {
    const payloadJson = new TextDecoder().decode(base64UrlDecodeToBytes(p));
    const payload = JSON.parse(payloadJson) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== "admin") return null;
    if (payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

