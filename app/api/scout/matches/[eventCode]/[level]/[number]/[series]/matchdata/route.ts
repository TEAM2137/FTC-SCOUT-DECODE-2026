import { NextRequest, NextResponse } from 'next/server' 
import connectDB from "@/lib/db"
import MatchScore from "@/models/decode/MatchScore"

export async function GET( _req: NextRequest, ctx: RouteContext<'/api/scout/matches/[eventCode]/[level]/[number]/[series]/matchdata'> ) {
    const params = await ctx.params;
    const eventCode = params.eventCode
    const level = params.level
    const number = params.number
    const series = params.series

    await connectDB();
    const data = await MatchScore.find({ eventCode: eventCode, matchLevel: level, matchNumber: number, matchSeries: series });
    if (data === null) {
        return new Response('No Match Data found', { status: 404 })
    }

  return NextResponse.json(data)
}