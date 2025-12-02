import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = (formData.get("email") || "").toString().trim();

  // Very basic validation; replace with a real provider/integration if needed
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const url = new URL(req.url);
  url.pathname = "/newsletter/success";

  if (!isValidEmail) {
    url.searchParams.set("newsletterError", "1");
    return NextResponse.redirect(url);
  }

  // In demo mode we don't persist; just pretend it's saved and redirect
  return NextResponse.redirect(url);
}


