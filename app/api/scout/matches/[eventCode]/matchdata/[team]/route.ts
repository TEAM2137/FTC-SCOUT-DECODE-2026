import { NextRequest, NextResponse } from 'next/server' 
import connectDB from "@/lib/db"
import MatchScore from "@/models/decode/MatchScore"

export async function GET( _req: NextRequest, ctx: RouteContext<'/api/scout/matches/[eventCode]/matchdata/[team]'> ) {
    const params = await ctx.params;
    const eventCode = params.eventCode
    const team = params.team


    await connectDB();
    const data = await MatchScore.find({ eventCode: eventCode, teamNumber: team });
    if (data === null) {
        return new Response('No Match Data found', { status: 404 })
    }

  return NextResponse.json(data)
}