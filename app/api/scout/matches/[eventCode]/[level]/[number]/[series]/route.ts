import { NextRequest, NextResponse } from 'next/server' 
import connectDB from "@/lib/db"
import ScheduleMatch from "@/models/ftc/ScheduleMatch"

export async function GET( _req: NextRequest, ctx: RouteContext<'/api/scout/matches/[eventCode]/[level]/[number]/[series]'> ) {
    const params = await ctx.params;
    const eventCode = params.eventCode
    const level = params.level
    const number = params.number
    const series = params.series

    await connectDB();
    const data = await ScheduleMatch.findOne({ eventCode: eventCode, matchLevel: level, matchNumber: number, matchSeries: series });
    if (data === null) {
        return new Response('No Matches found', { status: 404 })
    }

  return NextResponse.json(data)
}