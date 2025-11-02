
export const dynamic = 'force-static';
export const revalidate = 120;

import connectDB from "@/lib/db"
import Event from "@/models/ftc-api/Event"

export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, }> } ) {
    const event_key = (await params).eventid
    await connectDB();
    const data = await Event.findOne({ code: event_key });
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