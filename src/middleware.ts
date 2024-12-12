import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || ""
);

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtToken = request.cookies.get("jwt")?.value;

  // Якщо немає JWT
  if (!jwtToken) {
    if (pathname !== "/auth") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
  }

  try {
    // Перевірка токена
    const { payload } = await jwtVerify(jwtToken, SECRET_KEY);

    // Якщо роль admin і не на /admin, редірект на /admin
    if (payload.role === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Якщо це /admin і роль не admin, редірект на /
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.log("JWT verification error:", error);
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/admin/:path*", "/admin"], // Список маршрутів
};
