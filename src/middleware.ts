import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token with backend
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          cookie: `auth_token=${authToken.value}`,
        },
      });

      if (!response.ok) {
        // Token invalid or expired, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Middleware auth check failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authToken && request.nextUrl.pathname === "/login") {
    // Verify token is valid before redirecting
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          cookie: `auth_token=${authToken.value}`,
        },
      });

      if (response.ok) {
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // Token invalid, let them access login page
    } catch (error) {
      console.error("Middleware auth check for login page failed:", error);
      // On error, let them access login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
