'use server'


export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode

    const resRankings = await fetch(process.env.THIS_SERVER_URL + '/api/scout/rankings/' + eventCode, {cache: 'force-cache', next: { revalidate: 60 }});
    const rankings = await resRankings.json();

    return new Response(JSON.stringify(rankings), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
}