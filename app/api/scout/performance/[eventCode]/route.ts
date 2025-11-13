import connectDB from "@/lib/db"
import Event from "@/models/ftc/Event"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    await connectDB();
    const data = await Event.findOne({ eventCode: eventCode });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }

    const performanceData = []

    // Save Event Team Summaries
    for (let i = 0; i < data.teamList.length; i++ ) {
        const team = data.teamList[i];
        
        const res = await fetch (process.env.THIS_SERVER_URL + '/api/scout/performance/' + eventCode + '/' + team.teamNumber, {cache: 'force-cache', next: { revalidate: 15 }});
        const resData = await res.json();
        for (let i = 0; i < resData.length; i++) {
          const record = resData[i];
          performanceData.push(record);
        }
    }

  return new Response(JSON.stringify(performanceData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}