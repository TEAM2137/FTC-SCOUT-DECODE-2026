import connectDB from "@/lib/db"
import Rankings from "@/models/ftc/Rankings"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const update = await fetch(process.env.THIS_SERVER_URL + '/api/ftc-events/rankings/' + eventCode, {cache: 'force-cache', next: { revalidate: 120 }});
    const updateStatus = await update.json();
    console.log(updateStatus);

    await connectDB();
    const data = await Rankings.find({ eventCode: eventCode });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }

    //filter duplicates
    const rankings = [];
    const teams = [];
    for (let i = 0; i < data.length; i++ ) {
        const ranking = data[i];
        teams.push(ranking.teamNumber);
        if (!teams.includes(ranking.teamNumber)) {
            rankings.push(ranking);
        }
    }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}