'use server'

import connectDB from "@/lib/db"
import Event from "@/models/ftc-api/Event"

export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, }> } ) {
    const team_key = (await params).eventid
    await connectDB();
    const data = await Event.findOne({ code: team_key });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}