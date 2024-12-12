import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined in the environment variables");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    console.log(backendResponse);
    const { access_token } = await backendResponse.json();

    const response = NextResponse.json({ success: true });
    response.cookies.set("jwt", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
