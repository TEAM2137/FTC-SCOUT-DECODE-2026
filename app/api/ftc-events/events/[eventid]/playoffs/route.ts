'use server'

//import connectDB from "@/lib/db"
//import Schedule from "@/models/ftc-api/Schedule"

export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, }> } ) {
    const event_key = (await params).eventid

    // Set API Path to FRC Events API
    const apiPath = process.env.FTC_API_URL + '/2025/schedule/' + event_key + '/playoff/hybrid'
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

    const schedule = data.schedule

  return new Response(JSON.stringify(schedule), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}