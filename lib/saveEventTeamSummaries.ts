'use server'

import connectDB from "@/lib/db"
import TeamEventMatchSummary from "@/models/decode/TeamEventMatchSummary";

interface IScheduleMatch
{
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    description: string,
    startTime: string,
    actualStartTime: string,
    postResultTime: string,
    scoreRedFinal: number,
    scoreRedFoul: number,
    scoreRedAuto: number,
    scoreBlueFinal: number,
    scoreBlueFoul: number,
    scoreBlueAuto: number,
    redWins: boolean,
    blueWins: boolean,
    randomization: number,
    played: boolean,
    teams: [
       {
        teamNumber: number,
        station: string,
        surrogate: boolean,
        noShow: boolean,
        dq: boolean,
        onField: boolean,
        teamName: string,
        autoLeave: boolean,
        teleBase: string
      }
    ]
}

interface IMatchScore
{
      scoutID: string,
      scoutTeam: string,
      scoutName: string,
      eventCode: string,
      matchLevel: string,
      matchNumber: number,
      matchSeries: number,
      teamNumber: number,
      autoArtifacts: number,
      teleArtifacts: number,
      autoLeave: number,
      teleBaseFull: number,
      teleBasePartial: number,
      doubleBaseRaise: number,
      doubleBaseLift: number,
      score: number,
      ignore: boolean,
      hide: boolean,
}

interface IMatchTeamSummary
{
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    teamNumber: number,
    teamName: string,
    alliance: string,
    station: string,
    allianceWon: number,
    allianceLost: number,
    allianceTied: number,
    allianceAuto: number,
    allianceFinal: number,
    allianceFoul: number,
    autoLeave: number,
    teleBase: string,
    autoArtifacts: number,
    teleArtifacts: number,
    doubleBaseRaise: number,
    doubleBaseLift: number,
    score: number,
    totalArtifacts: number,
    scoutAutoLeave: number,
    scoutTeleBasePartial: number,
    scoutTeleBaseFull: number,
    scouted: number,
}

export async function saveEventTeamSummaries(eventCode: string, teamNumber: number) {

    const TeamEventMatchesSummary: IMatchTeamSummary[] = [];
    try {

    const matchesResponse = await fetch(process.env.THIS_SERVER_URL + '/api/cache/' + eventCode + '/matches/' + teamNumber, {cache: 'force-cache', next: { revalidate: 15 }});
    if (!matchesResponse.ok) {
        return ([]);
    }
    const matches: IScheduleMatch[] = await matchesResponse.json();

    const scoutMatchesResponse = await fetch(process.env.THIS_SERVER_URL + '/api/cache/' + eventCode + '/matchdata/' + teamNumber, {cache: 'force-cache', next: { revalidate: 15 }});
    if (!scoutMatchesResponse.ok) {
        return ([]);
    }
    const scoutMatches: IMatchScore[] = await scoutMatchesResponse.json();

    if (matches.length < 1) {
        return ([]);
    }
    
    for (let i = 0; i < matches.length; i++ ) {
        const match = matches[i];

        // Create new Match team sumary object
        const newMatchTeamSummary: IMatchTeamSummary = {
            eventCode: eventCode,
            matchLevel: match.matchLevel,
            matchNumber: match.matchNumber,
            matchSeries: match.matchSeries,
            teamNumber: teamNumber,
            teamName: '',
            alliance: '',
            station: '',
            allianceWon: 0,
            allianceLost: 0,
            allianceTied: 0,
            allianceAuto: 0,
            allianceFinal: 0,
            allianceFoul: 0,
            autoLeave: 0,
            teleBase: '',
            autoArtifacts: 0,
            teleArtifacts: 0,
            doubleBaseRaise: 0,
            doubleBaseLift: 0,
            score: 0,
            totalArtifacts: 0,
            scoutAutoLeave: 0,
            scoutTeleBasePartial: 0,
            scoutTeleBaseFull: 0,
            scouted: 0,
        }

        
        // Get Team Details

        for (let j = 0; j < match.teams.length; j++ ) {
            const team = match.teams[j];
            if (team.teamNumber == teamNumber) {
                newMatchTeamSummary.station = team.station;
                if (team.autoLeave) { newMatchTeamSummary.autoLeave = 3; }
                newMatchTeamSummary.teleBase = team.teleBase;
                newMatchTeamSummary.teamName = team.teamName;

                //ALLIANCE LEVEL DATA
                if (team.station === 'Red1' || team.station === 'Red2') {
                    newMatchTeamSummary.alliance = 'Red';
                    if (match.redWins) {newMatchTeamSummary.allianceWon = 1;}
                    if (match.blueWins) {newMatchTeamSummary.allianceLost = 1;}
                    if (!match.redWins && !match.blueWins) {newMatchTeamSummary.allianceTied = 1;}
                    newMatchTeamSummary.allianceAuto = match.scoreRedAuto;
                    newMatchTeamSummary.allianceFinal = match.scoreRedFinal;
                    newMatchTeamSummary.allianceFoul = match.scoreRedFoul;
                } else if (team.station === 'Blue1' || team.station === 'Blue2') { 
                    newMatchTeamSummary.alliance = 'Blue'; 
                    if (match.blueWins) {newMatchTeamSummary.allianceWon = 1;}
                    if (match.redWins) {newMatchTeamSummary.allianceLost = 1;}
                    if (!match.redWins && !match.blueWins) {newMatchTeamSummary.allianceTied = 1;}
                    newMatchTeamSummary.allianceAuto = match.scoreBlueAuto;
                    newMatchTeamSummary.allianceFinal = match.scoreBlueFinal;
                    newMatchTeamSummary.allianceFoul = match.scoreBlueFoul;
                }

            }
        }

        

        //SCOUT MATCH DATA
        const currentMatchScore = scoutMatches.filter((matchScore) => matchScore.matchLevel === match.matchLevel && 
                                                                        matchScore.matchNumber === match.matchNumber && 
                                                                        matchScore.matchSeries === match.matchSeries &&
                                                                        matchScore.hide === false &&
                                                                        matchScore.ignore === false);   
        if (currentMatchScore.length === 1) {
            newMatchTeamSummary.autoArtifacts = currentMatchScore[0].autoArtifacts;
            newMatchTeamSummary.teleArtifacts = currentMatchScore[0].teleArtifacts;
            newMatchTeamSummary.doubleBaseRaise = currentMatchScore[0].doubleBaseRaise;
            newMatchTeamSummary.doubleBaseLift = currentMatchScore[0].doubleBaseLift;
            newMatchTeamSummary.score = currentMatchScore[0].score;
            newMatchTeamSummary.totalArtifacts = newMatchTeamSummary.autoArtifacts + newMatchTeamSummary.teleArtifacts;
            newMatchTeamSummary.scoutAutoLeave = currentMatchScore[0].autoLeave * 3;
            newMatchTeamSummary.scoutTeleBasePartial = currentMatchScore[0].teleBasePartial * 5;
            newMatchTeamSummary.scoutTeleBaseFull = currentMatchScore[0].teleBaseFull * 10;
            newMatchTeamSummary.scouted = 1;
        }
        if (currentMatchScore.length > 1) {
            const ARRautoArtifacts: number[] = [];
            const ARRteleArtifacts: number[] = [];
            const ARRdoubleBaseRaise: number[] = [];
            const ARRdoubleBaseLift: number[] = [];
            const ARRscore: number[] = [];
            const ARRtotalArtifacts: number[] = [];
            const ARRscoutAutoLeave: number[] = [];
            const ARRscoutTeleBasePartial: number[] = [];
            const ARRscoutTeleBaseFull: number[] = [];

            for (let j = 0; j < currentMatchScore.length; j++ ) {
                const matchScore = currentMatchScore[j];
                ARRautoArtifacts.push(matchScore.autoArtifacts);
                ARRteleArtifacts.push(matchScore.teleArtifacts);
                ARRdoubleBaseRaise.push(matchScore.doubleBaseRaise);
                ARRdoubleBaseLift.push(matchScore.doubleBaseLift);
                ARRscore.push(matchScore.score);
                ARRtotalArtifacts.push(matchScore.autoArtifacts + matchScore.teleArtifacts);
                ARRscoutAutoLeave.push(matchScore.autoLeave * 3);
                ARRscoutTeleBasePartial.push(matchScore.teleBasePartial * 5);
                ARRscoutTeleBaseFull.push(matchScore.teleBaseFull * 10);
            }
            //Calculate Averages and round up - ceiling
            newMatchTeamSummary.autoArtifacts = Math.ceil(ARRautoArtifacts.reduce((a, b) => a + b, 0) / ARRautoArtifacts.length);
            newMatchTeamSummary.teleArtifacts = Math.ceil(ARRteleArtifacts.reduce((a, b) => a + b, 0) / ARRteleArtifacts.length);
            newMatchTeamSummary.doubleBaseRaise = Math.ceil(ARRdoubleBaseRaise.reduce((a, b) => a + b, 0) / ARRdoubleBaseRaise.length);
            newMatchTeamSummary.doubleBaseLift = Math.ceil(ARRdoubleBaseLift.reduce((a, b) => a + b, 0) / ARRdoubleBaseLift.length);
            newMatchTeamSummary.score = Math.ceil(ARRscore.reduce((a, b) => a + b, 0) / ARRscore.length);
            newMatchTeamSummary.totalArtifacts = Math.ceil(ARRtotalArtifacts.reduce((a, b) => a + b, 0) / ARRtotalArtifacts.length);
            newMatchTeamSummary.scoutAutoLeave = Math.ceil(ARRscoutAutoLeave.reduce((a, b) => a + b, 0) / ARRscoutAutoLeave.length);
            newMatchTeamSummary.scoutTeleBasePartial = Math.ceil(ARRscoutTeleBasePartial.reduce((a, b) => a + b, 0) / ARRscoutTeleBasePartial.length);
            newMatchTeamSummary.scoutTeleBaseFull = Math.ceil(ARRscoutTeleBaseFull.reduce((a, b) => a + b, 0) / ARRscoutTeleBaseFull.length);
            newMatchTeamSummary.scouted = 1;
        }



        //if (newMatchTeamSummary.teleBase === 'FULL' && newMatchTeamSummary.scoutTeleBaseFull === 0) { newMatchTeamSummary.scoutTeleBaseFull = 10; }
        //if (newMatchTeamSummary.teleBase === 'PARTIAL' && newMatchTeamSummary.scoutTeleBasePartial === 0) { newMatchTeamSummary.scoutTeleBasePartial = 5; }



        //Save Match Team Summary to DB
        await connectDB();
        await TeamEventMatchSummary.findOneAndUpdate({ eventCode: newMatchTeamSummary.eventCode, matchLevel: newMatchTeamSummary.matchLevel, matchNumber: newMatchTeamSummary.matchNumber, matchSeries: newMatchTeamSummary.matchSeries, teamNumber: newMatchTeamSummary.teamNumber }, newMatchTeamSummary, { upsert: true });


        TeamEventMatchesSummary.push(newMatchTeamSummary);

    }

    } catch (err) {
        console.log(err)
    }

    //return TeamEventMatchesSummary
    return (TeamEventMatchesSummary)
}