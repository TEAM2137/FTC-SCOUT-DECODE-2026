import connectDB from "@/lib/db"
import Award from "@/models/ftc/Awards"

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    let updated = true;
    let message = "Awards Updated";

    // Set Headers for API Auth
    const headers = {
        'Authorization': `Basic ${process.env.FTC_API_KEY}`,
        'Content-Type': 'application/json'
    }

    // Get All Team Details
    const teamapiPath = process.env.FTC_API_URL + '/2025/teams?eventCode=' + eventCode
    const teamresponse = await fetch(teamapiPath, {
        headers: headers, cache: 'force-cache', next: { revalidate: 300 }
    })
    const teamdata = await teamresponse.json()
    //console.log(teamdata)




    // Fetch Awards from API
    const apiPath = process.env.FTC_API_URL + '/2025/awards/' + eventCode
    const response = await fetch(apiPath, {
        headers: headers
    })    
    const data = await response.json()
    const awards = data.awards

    if (awards.length < 1) {
        updated = false;
        message = "No Awards Retrieved";
    }

    await connectDB();

    const sortIDs: number[] = [0,40,99,99,37,99,39,36,34,33,99,30,32,31,99,99,99,99,99,99,99,99,99,99,99,38,35,99,99,99]
    for (let i = 0; i < awards.length; i++ ) {
        const award = awards[i];
        let teamName = ""
        //console.log(award.teamNumber + ' ' + award.name)

        for (let j = 0; j < teamdata.teams.length; j++ ) {
            const team = teamdata.teams[j]
            if (team.teamNumber == award.teamNumber) {
                teamName = team.nameShort
                //console.log(teamName)
                break;
             }
        }

        const newAward = 
            {
                awardId: award.awardId,
                sortId: sortIDs[award.awardId],
                teamId: award.teamId,
                teamProfileId: award.teamProfileId,
                eventId: award.eventId,
                eventDivisionId: award.eventDivisionId,
                eventCode: eventCode,
                name: award.name,
                series: award.series,
                teamNumber: award.teamNumber,
                teamName: teamName,
                schoolName: award.schoolName,
                fullTeamName: award.fullTeamName,
                person: award.person,
            }
            //console.log(newAward)   
        try {
        await Award.findOneAndUpdate({ eventCode: newAward.eventCode, awardId: newAward.awardId, series: newAward.series }, newAward, { upsert: true });
        } catch (err) {
            console.log(err)
            updated = false;
            message = "Awards Not Saved to Database";
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