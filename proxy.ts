import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isDashboardPage = pathname.startsWith("/dashboard")

  // Redirect authenticated users away from auth pages
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect dashboard routes
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}

