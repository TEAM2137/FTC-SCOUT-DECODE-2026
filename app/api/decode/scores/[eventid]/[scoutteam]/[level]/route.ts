'use server'

import connectDB from "@/lib/db"
import MatchScore from "@/models/decode/MatchScore"





export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, scoutteam: string, level: string }>} ) {
    const event_key = (await params).eventid
    const scout_team = (await params).scoutteam
    const level = (await params).level

    let feapiLevel = 'qual'
    if (level === 'Playoff') {
        feapiLevel = 'playoff'
    }

    await connectDB();
    const scoutdata = await MatchScore.find({eventid: event_key, scoutTeam: scout_team}).sort({ matchNmber: 1, teamNumber: 1 });
    const matchScores = scoutdata

    //clean up matchScores and Average duplicates
    let matchScoresGrouped: any = {}
    for (let i = 0; i < matchScores.length; i++ ) {
        const matchScore = matchScores[i];
        console.log(matchScore.matchNumber + ' - ' + matchScore.teamNumber)
        matchScoresGrouped[matchScore.matchNumber + '-' + matchScore.teamNumber].push(matchScore);
    }

    let matchScoresCleaned: any = {}
    for (const key in matchScoresGrouped) {
        const matchScores = matchScoresGrouped[key]
        const scoutID = 'multiple_' + matchScores[0].eventid + '_' + level + '_' + matchScores[0].matchNumber + '_' + matchScores[0].teamNumber
        const eventID = matchScores[0].eventid
        const tournamentLevel = level
        const matchNumber = matchScores[0].matchNumber
        const teamNumber = matchScores[0].teamNumber
        const station = matchScores[0].station
        let autoArtifacts = matchScores[0].autoArtifacts
        let teleArtifacts = matchScores[0].teleArtifacts
        let autoLeave = matchScores[0].autoLeave
        let teleBaseFull = matchScores[0].teleBaseFull
        let teleBasePartial = matchScores[0].teleBasePartial
        let doubleBaseRaise = matchScores[0].doubleBaseRaise
        let doubleBaseLift = matchScores[0].doubleBaseLift
        let score = matchScores[0].score
        const use = true
        if (matchScores.length > 1) {
            for (let i = 1; i < matchScores.length; i++ ) {
                autoArtifacts += matchScores[i].autoArtifacts
                teleArtifacts += matchScores[i].teleArtifacts
                autoLeave += matchScores[i].autoLeave
                teleBaseFull += matchScores[i].teleBaseFull
                teleBasePartial += matchScores[i].teleBasePartial
                doubleBaseRaise += matchScores[i].doubleBaseRaise
                doubleBaseLift += matchScores[i].doubleBaseLift
                score += matchScores[i].score
            }
            autoArtifacts = Math.round(autoArtifacts / matchScores.length)
            teleArtifacts = Math.round(teleArtifacts / matchScores.length)
            autoLeave = Math.round(autoLeave / matchScores.length)
            teleBaseFull = Math.round(teleBaseFull / matchScores.length)
            teleBasePartial = Math.round(teleBasePartial / matchScores.length)
            doubleBaseRaise = Math.round(doubleBaseRaise / matchScores.length)
            doubleBaseLift = Math.round(doubleBaseLift / matchScores.length)
            score = Math.round(score / matchScores.length)
        }
        matchScoresCleaned[key] = {scoutID: scoutID, scoutTeam: scout_team, scoutName: scout_team, eventid: eventID, tournamentLevel: tournamentLevel, matchNumber: matchNumber, teamNumber: teamNumber, station: station, autoArtifacts: autoArtifacts, teleArtifacts: teleArtifacts, autoLeave: autoLeave, teleBaseFull: teleBaseFull, teleBasePartial: teleBasePartial, doubleBaseRaise: doubleBaseRaise, doubleBaseLift: doubleBaseLift, score: score, use: use}
    }

    //console.log(matchScoresClean)


    const scheduleData = await fetch(`${process.env.THIS_SERVER_URL}/api/decode/schedule/${event_key}/Qualification`)



    const combinedData = []

    if (scheduleData.status === 200) {
        console.log('Schedule Retrieved')
        const schedule = await scheduleData.json()
        for (let i = 0; i < schedule.length; i++ ) {
            const scheduleItem = schedule[i];
            const match = scheduleItem.matchNumber
            const team = scheduleItem.teamNumber
            const matchScore = scoutdata.filter((matchScore) => matchScore.matchNmber === match && matchScore.teamNumber === team)
            if (matchScore.length > 0) {
                const matchScoreItem = matchScore[0]
                combinedData.push(matchScoreItem)
            }
        }

    }

  return new Response(JSON.stringify(matchScoresCleaned) , {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
}   