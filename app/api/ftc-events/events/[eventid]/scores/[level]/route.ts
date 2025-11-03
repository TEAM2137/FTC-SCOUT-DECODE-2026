export const dynamic = 'force-static';
export const revalidate = 120;

import connectDB from "@/lib/db"
import Score from "@/models/ftc-api/Score"

export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, level: string,}> } ) {
    const event_key = (await params).eventid
    const level = (await params).level

    // Set API Path to FRC Events API
    const apiPath = process.env.FTC_API_URL + '/2025/scores/' + event_key + '/' + level
    // Set Headers for API Auth
    const headers = {
    'Authorization': `Basic ${process.env.FTC_API_KEY}`,
    'Content-Type': 'application/json'
    }
    // Fetch Schedule from API
    const response = await fetch(apiPath, {
        headers: headers
    })
    const data = await response.json()

    const matchScores = data.matchScores

    let newLevel = 'Qualification'
    if (level === 'playoff') {
        newLevel = 'Playoff'
    }


    const newScores = {
        scoreID: event_key + '_' + newLevel,
        eventCode: event_key,
        tournamentLevel: newLevel,
        matchScores: matchScores
    }

    try {
        await connectDB()
        const data = await Score.findOneAndUpdate({ eventCode: newScores.eventCode }, newScores, { upsert: true });
        console.log('Scores Saved');
    } catch (err) {
        console.log(err)
    }

  return new Response(JSON.stringify(matchScores), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}