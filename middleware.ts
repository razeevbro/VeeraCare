import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionEdge } from "./src/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Guard only the dashboard area (login remains public).
  if (pathname.startsWith("/admin/dashboard")) {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthed =
      Boolean(secret) && Boolean(token)
        ? Boolean(await verifyAdminSessionEdge(token!, secret!))
        : false;
    if (!isAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

