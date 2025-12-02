import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = (formData.get("email") || "").toString().trim();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const url = new URL(req.url);
  url.pathname = "/newsletter/success";

  if (!isValidEmail) {
    url.searchParams.set("newsletterError", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(url);
}


