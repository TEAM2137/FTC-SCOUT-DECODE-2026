
import connectDB from "@/lib/db"
import Award from "@/models/ftc/Awards"

interface IAward {
    eventCode: string,
    awardId: number,
    sortId: number,
    teamId: number,
    teamProfileId: number,
    eventId: number,
    eventDivisionId: number,
    name: string,
    series: number,
    teamNumber: number,
    teamName: string,
    schoolName: string,
    fullTeamName: string,
    person: string,
}

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const update = await fetch(process.env.THIS_SERVER_URL + '/api/ftc-events/awards/' + eventCode, {cache: 'force-cache', next: { revalidate: 30 }});
    const updateStatus = await update.json();
    console.log(updateStatus);

    await connectDB();
    const data = await Award.find({ eventCode: eventCode });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }
    data.sort((a: IAward, b: IAward) => a.series - b.series).sort((a: IAward, b: IAward) => a.sortId - b.sortId);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}