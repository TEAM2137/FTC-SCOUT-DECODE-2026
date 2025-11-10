import { NextRequest, NextResponse } from 'next/server' 
import connectDB from "@/lib/db"
import ScheduleMatch from "@/models/ftc/ScheduleMatch"

export async function GET( _req: NextRequest, ctx: RouteContext<'/api/scout/events/[eventCode]/matches/[team]'> ) {
    const params = await ctx.params;
    const eventCode = params.eventCode
    const team = params.team


    await connectDB();
    const data = await ScheduleMatch.find({ eventCode: eventCode, "teams.teamNumber": team });
    if (data === null) {
        return new Response('No Match Data found', { status: 404 })
    }

  return NextResponse.json(data)
}