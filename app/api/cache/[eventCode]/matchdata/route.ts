'use server'


export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const resMatchData = await fetch(process.env.THIS_SERVER_URL + '/api/scout/matches/' + eventCode + '/matchdata', {cache: 'force-cache', next: { revalidate: 30 }});
    const matches = await resMatchData.json();

    return new Response(JSON.stringify(matches), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
}