import { NextResponse } from "next/server";
import { setAdminSession, verifyCsrfToken } from "@/lib/CsrfSessionManagement";

function parseCookies(cookieHeader: string | null) {
	const cookies: Record<string, string> = {};
	if (!cookieHeader) return cookies;
	for (const pair of cookieHeader.split(";")) {
		const [k, ...v] = pair.split("=");
		const key = k?.trim();
		if (!key) continue;
		cookies[key] = decodeURIComponent((v || []).join("=").trim());
	}
	return cookies;
}

export async function POST(req: Request) {
	const cookieHeader = req.headers.get("cookie");
	const cookies = parseCookies(cookieHeader);
	const csrf = cookies["csrf"] ?? null;

	if (!verifyCsrfToken(csrf)) {
		return NextResponse.json({ error: "Invalid CSRF token" }, { status: 400 });
	}
	const form = await req.formData();
	const username = (form.get("username") || "").toString();
	const password = (form.get("password") || "").toString();

	const expected = process.env.ADMIN_PASSWORD || "admin123";
	if (!username || password !== expected) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	setAdminSession();
	const res = NextResponse.redirect(new URL("/admin", req.url));
	res.cookies.set("csrf", "", { maxAge: 0, path: "/", httpOnly: true, secure: true, sameSite: "lax" });
	return res;
}
