
export const dynamic = 'force-static';
export const revalidate = 120;

//import connectDB from "@/lib/db"
//import Schedule from "@/models/ftc-api/Schedule"

export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, }> } ) {
    const event_key = (await params).eventid

    // Set API Path to FRC Events API
    const apiPath = process.env.FTC_API_URL + '/2025/rankings/' + event_key 
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

    const rankings = data.rankings

  return new Response(JSON.stringify(rankings), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}