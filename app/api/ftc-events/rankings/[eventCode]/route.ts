

import connectDB from "@/lib/db"
import Rankings from "@/models/ftc/Rankings"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    let updated = true;
    let message = "Rankings Updated";


    // Set API Path to FRC Events API
    const apiPath = process.env.FTC_API_URL + '/2025/rankings/' + eventCode
    // Set Headers for API Auth
    const headers = {
        'Authorization': `Basic ${process.env.FTC_API_KEY}`,
        'Content-Type': 'application/json'
    }
    // Fetch Events from API
    const response = await fetch(apiPath, {
        headers: headers, cache: 'force-cache', next: { revalidate: 30 }
    })
    const data = await response.json()
    const rankings = data.rankings

    if (rankings.length < 1) {
        updated = false;
        message = "No Rankings Retrieved";
    }

    await connectDB();

    for (let i = 0; i < rankings.length; i++ ) {
        const ranking = rankings[i];
        const newRanking = 
            {
                eventCode: eventCode,
                rank: ranking.rank,
                teamNumber: ranking.teamNumber,
                teamName: ranking.teamName,
                sortOrder1: ranking.sortOrder1,
                sortOrder2: ranking.sortOrder2,
                sortOrder3: ranking.sortOrder3,
                sortOrder4: ranking.sortOrder4,
                sortOrder5: ranking.sortOrder5,
                sortOrder6: ranking.sortOrder6,
                wins: ranking.wins,
                losses: ranking.losses,
                ties: ranking.ties,
                qualAverage: ranking.qualAverage,
                dq: ranking.dq,
                matchesPlayed: ranking.matchesPlayed,
                matchesCounted: ranking.matchesCounted,
            }

        try {
        await Rankings.findOneAndUpdate({ eventCode: newRanking.eventCode, rank: newRanking.rank }, newRanking, { upsert: true });
        } catch (err) {
            console.log(err)
            updated = false;
            message = "Rankings Not Saved to Database";
        }
    }

    const result = { updated: updated, message: message };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}