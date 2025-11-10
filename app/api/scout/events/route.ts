
import connectDB from "@/lib/db"
import Event from "@/models/ftc/Event"

export async function GET() {

    await connectDB();
    const data = await Event.find().sort({ weekStart: 1 });

    

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}