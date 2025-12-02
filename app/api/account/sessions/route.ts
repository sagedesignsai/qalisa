import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
      },
      orderBy: { expires: "desc" },
    })

    // Note: With JWT strategy, we can't easily identify the current session
    // The most recent session is likely the current one
    const formattedSessions = sessions.map((s, index) => ({
      id: s.id,
      isCurrent: index === 0, // Mark most recent as current
      expires: s.expires,
      device: "Unknown", // Could be enhanced with user-agent parsing
      location: "Unknown", // Could be enhanced with IP geolocation
    }))

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error("Get sessions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

