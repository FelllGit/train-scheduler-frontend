import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie");
  const jwtMatch = cookies?.match(/jwt=([^;]+)/);
  const jwt = jwtMatch ? jwtMatch[1] : null;

  if (!jwt) {
    return NextResponse.json({ message: "JWT not found" }, { status: 401 });
  }

  return NextResponse.json({ jwt }, { status: 200 });
}
