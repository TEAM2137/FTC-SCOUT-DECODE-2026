'use server'

import connectDB from "@/lib/db"
import Team from "@/models/ftc-api/Team"
import Region from "@/models/filters/Regions"

export async function GET() {
  // Set API Path to FRC Events API
  const apiPath = process.env.FTC_API_URL + '/2025/teams'
  // Set Headers for API Auth
  const headers = {
    'Authorization': `Basic ${process.env.FTC_API_KEY}`,
    'Content-Type': 'application/json'
  }

  const output = {
    teamCountTotal: 0,
    pageTotal: 0,
  }

  const teamlist = []

  for (let i = 1; i < 250; i++ ) {
    // Fetch Events from API
    console.log('Fetching TeamsPage: ' + i)

    const pageAPIpath = apiPath + `?page=${i}`
    const response = await fetch(pageAPIpath, {
        headers: headers
    })
    const data = await response.json()

    const teams = data.teams

    if (teams.length > 0) {
        output.pageTotal++
    }
    else {
        //break
    }

    for (let i = 0; i < teams.length; i++ ) {
        output.teamCountTotal++
        try {
            await connectDB()
            const newTeam = 
                {
                teamNumber: teams[i].teamNumber,
                displayTeamNumber: teams[i].displayTeamNumber,
                nameFull: teams[i].nameFull,
                nameShort: teams[i].nameShort,
                schoolName: teams[i].schoolName,
                city: teams[i].city,
                stateProv: teams[i].stateProv,
                country: teams[i].country,
                website: teams[i].website,
                rookieYear: teams[i].rookieYear,
                robotName: teams[i].robotName,
                districtCode: teams[i].districtCode,
                homeCMP: teams[i].homeCMP,
                homeRegion: teams[i].homeRegion,
                displayLocation: teams[i].displayLocation
                }


            console.log('Updating Data for Team Number: ' + newTeam.teamNumber)
            teamlist.push(newTeam.teamNumber)

            await Team.findOneAndUpdate({ teamNumber: newTeam.teamNumber }, newTeam, { upsert: true });

            //console.log(updateTeam)
        } catch (err) {
            console.log(err)
        }
    }

    }


    const newOutput = {
        PageCount: output.pageTotal,
        TeamCount: output.teamCountTotal,
        TeamsList: teamlist
    }

  return new Response(JSON.stringify(newOutput), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}