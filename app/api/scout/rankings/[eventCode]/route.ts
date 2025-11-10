import connectDB from "@/lib/db"
import Rankings from "@/models/ftc/Rankings"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const update = await fetch(process.env.THIS_SERVER_URL + '/api/ftc-events/rankings/' + eventCode);
    const updateStatus = await update.json();
    console.log(updateStatus);

    await connectDB();
    const data = await Rankings.find({ eventCode: eventCode });
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