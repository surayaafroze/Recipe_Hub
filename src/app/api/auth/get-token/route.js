import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value 
             || cookieStore.get("__Secure-better-auth.session_token")?.value 
             || "";
             
  return NextResponse.json({ token });
}
