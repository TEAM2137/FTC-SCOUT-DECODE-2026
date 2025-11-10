
import connectDB from "@/lib/db"
import Event from "@/models/ftc/Event"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    await connectDB();
    const data = await Event.findOne({ eventCode: eventCode });
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