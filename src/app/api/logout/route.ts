import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Видаляємо JWT cookie
  response.cookies.set("jwt", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
