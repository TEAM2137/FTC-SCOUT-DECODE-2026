import connectDB from "@/lib/db"
import Alliances from "@/models/ftc/Alliances"

interface IAlliance 
    {
    eventCode: string,
    number: number,
    name: string,
    captain: number,
    captainDisplay: string,
    round1: number,
    round1Display: string,
    round2: number,
    round2Display: string,
    round3: number,
    backup: number,
    backupReplaced: number
    }

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const update = await fetch(process.env.THIS_SERVER_URL + '/api/ftc-events/alliances/' + eventCode);
    const updateStatus = await update.json();
    console.log(updateStatus);

    await connectDB();
    const data = await Alliances.find({ eventCode: eventCode });
    if (data === null) {
        return new Response('No Alliances not found', { status: 404 })
    }
    data.sort((a: IAlliance, b: IAlliance) => a.number - b.number)

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}