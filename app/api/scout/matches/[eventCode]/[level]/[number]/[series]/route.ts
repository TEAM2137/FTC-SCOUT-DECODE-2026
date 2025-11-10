import connectDB from "@/lib/db"
import ScheduleMatch from "@/models/ftc/ScheduleMatch"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, level: string, number: number, series: number }> } ): Promise<Response> {
    const eventCode = (await params).eventCode
    const level = (await params).level
    const number = (await params).number
    const series = (await params).series

    await connectDB();
    const data = await ScheduleMatch.findOne({ eventCode: eventCode, matchLevel: level, matchNumber: number, matchSeries: series });
    if (data === null) {
        return new Response('No Matches found', { status: 404 })
    }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}