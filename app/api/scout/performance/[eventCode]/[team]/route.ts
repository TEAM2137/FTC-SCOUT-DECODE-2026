import { NextRequest, NextResponse } from 'next/server' 
import { saveEventTeamSummaries } from "@/lib/saveEventTeamSummaries";

export async function GET( _req: NextRequest, ctx: RouteContext<'/api/scout/performance/[eventCode]/[team]'> ) {
    const params = await ctx.params;
    const eventCode = params.eventCode
    const team = Number(params.team)
    const output = [];
    try{
      const teamPerformance = await saveEventTeamSummaries(eventCode, team);
      if (teamPerformance.length > 0) {
        for (let i = 0; i < teamPerformance.length; i++ ) {
            const teamPerformanceItem = teamPerformance[i];
            output.push(teamPerformanceItem);
        }
      } else {
        return new Response('No Team Performance Data Found', { status: 404 })
      }
    } catch (err) {
        console.log(err)
    }

  return NextResponse.json(output)
}