import { NextResponse } from "next/server";
import { setAdminSession, verifyCsrfToken } from "@/lib/CsrfSessionManagement";

export async function POST(req: Request) {
  const form = await req.formData();
  const csrf = form.get("csrf")?.toString() ?? null;
  if (!verifyCsrfToken(csrf)) {
    // Redirect back to login with an error query so the UI can show a friendly message
    return NextResponse.redirect(new URL('/admin/login?error=csrf', req.url));
  }
  const username = (form.get("username") || "").toString();
  const password = (form.get("password") || "").toString();

  const expected = process.env.ADMIN_PASSWORD || "admin123"; // set securely in env
  if (!username || password !== expected) {
    // Redirect back to login with an error query so the UI can render a user-friendly message
    return NextResponse.redirect(new URL('/admin/login?error=invalid_credentials', req.url));
  }

  setAdminSession();
  return NextResponse.redirect(new URL("/admin", req.url));
}
