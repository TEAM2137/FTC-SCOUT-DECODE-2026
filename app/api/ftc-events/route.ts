'use server'

export async function GET() {
  // Set API Path to FRC Events API
  const apiPath = process.env.FTC_API_URL + ''
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
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}