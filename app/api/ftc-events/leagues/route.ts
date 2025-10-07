'use server'

import connectDB from "@/lib/db"
import League from "@/models/ftc-api/League"

export async function GET() {
  // Set API Path to FRC Events API
  const apiPath = process.env.FTC_API_URL + '/2025/leagues'
  // Set Headers for API Auth
  const headers = {
    'Authorization': `Basic ${process.env.FTC_API_KEY}`,
    'Content-Type': 'application/json'
  }
  // Fetch Events from API
  const response = await fetch(apiPath, {
    headers: headers
  })
  const data = await response.json()

  const leagues = data.leagues

  for (let i = 0; i < leagues.length; i++ ) {
    
    try {
        await connectDB()
        const newLeague = leagues[i]
        const updateEvent = await League.findOneAndUpdate({ code: newLeague.code }, newLeague, { upsert: true });
        console.log(updateEvent)
    } catch (err) {
        console.log(err)
    }
  }



  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}