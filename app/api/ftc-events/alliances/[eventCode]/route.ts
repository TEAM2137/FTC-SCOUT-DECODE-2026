
import connectDB from "@/lib/db"
import Alliances from "@/models/ftc/Alliances"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    let updated = true;
    let message = "Alliances Updated";

    // Set Headers for API Auth
    const headers = {
        'Authorization': `Basic ${process.env.FTC_API_KEY}`,
        'Content-Type': 'application/json'
    }

    // Get All Team Details
    const teamapiPath = process.env.FTC_API_URL + '/2025/teams?eventCode=' + eventCode
    const teamresponse = await fetch(teamapiPath, {
        headers: headers, cache: 'force-cache', next: { revalidate: 240 }
    })
    const teamdata = await teamresponse.json()
    //console.log(teamdata)


    // Fetch Awards from API
    const apiPath = process.env.FTC_API_URL + '/2025/alliances/' + eventCode
    const response = await fetch(apiPath, {
        headers: headers, cache: 'force-cache', next: { revalidate: 240 }
    })    
    const data = await response.json()
    const alliances = data.alliances

    if (alliances.length < 1) {
        updated = false;
        message = "No Awards Retrieved";
    }

    await connectDB();

    for (let i = 0; i < alliances.length; i++ ) {
        const alliance = alliances[i];
        //console.log(award.teamNumber + ' ' + award.name)

        for (let j = 0; j < teamdata.teams.length; j++ ) {
            const team = teamdata.teams[j]
            if (team.teamNumber == alliance.captain) {
                alliance.captainDisplay = team.nameShort
            }
            if (team.teamNumber == alliance.round1) {
                alliance.round1Display = team.nameShort
            }
            if (team.teamNumber == alliance.round2) {
                alliance.round2Display = team.nameShort
            }
        }

        const newAlliance = 
            {
                eventCode: eventCode,
                number: alliance.number,
                name: alliance.name,
                captain: alliance.captain,
                captainDisplay: alliance.captainDisplay,
                round1: alliance.round1,
                round1Display: alliance.round1Display,
                round2: alliance.round2,
                round2Display: alliance.round2Display,
                round3: alliance.round3,
                backup: alliance.backup,
                backupReplaced: alliance.backupReplaced,
            }
            //console.log(newAward)   
        try {
        await Alliances.findOneAndUpdate({ eventCode: newAlliance.eventCode, number: newAlliance.number }, newAlliance, { upsert: true });
        } catch (err) {
            console.log(err)
            updated = false;
            message = "Alliances Not Saved to Database";
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