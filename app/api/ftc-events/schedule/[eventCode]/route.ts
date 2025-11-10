import connectDB from "@/lib/db"
import ScheduleMatch from "@/models/ftc/ScheduleMatch"


interface Iupdated
{
    foundQualifierScores: boolean,
    foundPlayoffScores: boolean,
    savedMatches: boolean,
}

interface Iscore
{
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    randomization: number,
    played: boolean,
    Red1: Irobotperfomance,
    Red2: Irobotperfomance,
    Blue1: Irobotperfomance,
    Blue2: Irobotperfomance,
}

interface Irobotperfomance
{
    autoLeave: boolean,
    teleBase: string,
}



export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    const updated: Iupdated = { foundQualifierScores: false, foundPlayoffScores: false, savedMatches: false }
    const message = [];

    // Set Headers for API Auth
    const headers = {
        'Authorization': `Basic ${process.env.FTC_API_KEY}`,
        'Content-Type': 'application/json'
    }

    // Set API Path to FRC Events API for Scores
    const apiScoresQualifierPath = process.env.FTC_API_URL + '/2025/scores/' + eventCode + '/qual'
    const apiScoresPlayoffPath = process.env.FTC_API_URL + '/2025/scores/' + eventCode + '/playoff'

    // setup storage for scores
    const scores: Iscore[] = [];

    // Fetch Qualifier Scores from API
try{
    const qsresponse = await fetch(apiScoresQualifierPath, {
        headers: headers
    })    
    const qsdata = await qsresponse.json()
    const qualifierScores = qsdata.matchScores
    if (qualifierScores.length < 1) {
        message.push("No Qualifier Scores Retrieved");
    } else {
        updated.foundQualifierScores = true;

        for (let i = 0; i < qualifierScores.length; i++ ) {
            const Score = qualifierScores[i];
            const red1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const red2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const blue1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const blue2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }

            for (let j = 0; j < Score.alliances.length; j++ ) {
                const Alliance = Score.alliances[j];
                if (Alliance.alliance == 'Red') {
                    red1.autoLeave = Alliance.robot1Auto;
                    red1.teleBase = Alliance.robot1Teleop;
                    red2.autoLeave = Alliance.robot2Auto;
                    red2.teleBase = Alliance.robot2Teleop;
                }
                if (Alliance.alliance == 'Blue') {
                    blue1.autoLeave = Alliance.robot1Auto;
                    blue1.teleBase = Alliance.robot1Teleop;
                    blue2.autoLeave = Alliance.robot2Auto;
                    blue2.teleBase = Alliance.robot2Teleop; 
                }
            }

            const newScore = 
                {
                    eventCode: eventCode,
                    matchLevel: Score.matchLevel,
                    matchNumber: Score.matchNumber,
                    matchSeries: Score.matchSeries,
                    randomization: Score.randomization,
                    played: true,
                    Red1: red1,
                    Red2: red2,
                    Blue1: blue1,
                    Blue2: blue2,
                }
            scores.push(newScore);
        } 
    }
} catch (err) {
    console.log(err)
}
try{
    // Fetch Playoff Scores from API
    const psresponse = await fetch(apiScoresPlayoffPath, {
        headers: headers
    })    
    const psdata = await psresponse.json()
    const playoffScores = psdata.matchScores
    if (playoffScores.length < 1) {
        message.push("No Playoff Scores Retrieved");
    } else {
        updated.foundPlayoffScores = true;

        for (let i = 0; i < playoffScores.length; i++ ) {
            const Score = playoffScores[i];
            const red1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const red2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const blue1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            const blue2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }

            for (let j = 0; j < Score.alliances.length; j++ ) {
                const Alliance = Score.alliances[j];
                if (Alliance.alliance == 'Red') {
                    red1.autoLeave = Alliance.robot1Auto;
                    red1.teleBase = Alliance.robot1Teleop;
                    red2.autoLeave = Alliance.robot2Auto;
                    red2.teleBase = Alliance.robot2Teleop;
                }
                if (Alliance.alliance == 'Blue') {
                    blue1.autoLeave = Alliance.robot1Auto;
                    blue1.teleBase = Alliance.robot1Teleop;
                    blue2.autoLeave = Alliance.robot2Auto;
                    blue2.teleBase = Alliance.robot2Teleop; 
                }
            }

            const newScore = 
                {
                    eventCode: eventCode,
                    matchLevel: Score.matchLevel,
                    matchNumber: Score.matchSeries,
                    matchSeries: Score.matchNumber,
                    randomization: Score.randomization,
                    played: true,
                    Red1: red1,
                    Red2: red2,
                    Blue1: blue1,
                    Blue2: blue2,
                }
            scores.push(newScore);
        } 
    }
    
} catch (err) {
    console.log(err)
}

    // Set API Path for Hybrid Match Schedule
    const apiScheduleQualifierPath = process.env.FTC_API_URL + '/2025/schedule/' + eventCode + '/qual/hybrid'
    const apiSchedulePlayoffPath = process.env.FTC_API_URL + '/2025/schedule/' + eventCode + '/playoff/hybrid'

    const schedule = [];
try {
    // Fetch Hybrid QualifierMatch Schedule from API
    const scheduleQualifierResponse = await fetch(apiScheduleQualifierPath, {
        headers: headers
    })
    const scheduleQualifierData = await scheduleQualifierResponse.json()
    const scheduleQualifierSchedule = scheduleQualifierData.schedule
    if (scheduleQualifierSchedule.length < 1) {
        message.push("No Qualifier Schedule Retrieved");
    } else {
        updated.foundQualifierScores = true;

        for (let i = 0; i < scheduleQualifierSchedule.length; i++ ) {
            const Match = scheduleQualifierSchedule[i];
            let red1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let red2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let blue1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let blue2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let played: boolean = false;
            let randomization: number = 0;

            for (let j = 0; j < scores.length; j++ ) {
                if (scores[j].matchNumber === Match.matchNumber && 
                    scores[j].matchSeries === Match.series &&
                    scores[j].matchLevel === Match.tournamentLevel) {
                    randomization = scores[j].randomization;
                    played = true;
                    red1 = scores[j].Red1;
                    red2 = scores[j].Red2;
                    blue1 = scores[j].Blue1;
                    blue2 = scores[j].Blue2;
                    break;
                }
            }

            const Teams = []
            for (let j = 0; j < Match.teams.length; j++ ) {
                const Team = Match.teams[j];
                const station: string = Team.station;
                let autoLeave: boolean = false;
                let teleBase: string = 'NONE';

                if (station == 'Red1') { autoLeave = red1.autoLeave; teleBase = red1.teleBase; }
                if (station == 'Red2') { autoLeave = red2.autoLeave; teleBase = red2.teleBase; }
                if (station == 'Blue1') { autoLeave = blue1.autoLeave; teleBase = blue1.teleBase; }
                if (station == 'Blue2') { autoLeave = blue2.autoLeave; teleBase = blue2.teleBase; }

                const newTeam = {
                    teamNumber: Team.teamNumber,
                    station: Team.station,
                    surrogate: Team.surrogate,
                    noShow: Team.noShow,
                    dq: Team.dq,
                    onField: Team.onField,
                    teamName: Team.teamName,
                    autoLeave: autoLeave,
                    teleBase: teleBase,
                }
                Teams.push(newTeam);
            }
            const newMatch = 
                {
                    eventCode: eventCode,
                    matchLevel: Match.tournamentLevel,
                    matchNumber: Match.matchNumber,
                    matchSeries: Match.series,
                    description: Match.description,
                    startTime: Match.startTime,
                    actualStartTime: Match.actualStartTime,
                    postResultTime: Match.postResultTime,
                    scoreRedFinal: Match.scoreRedFinal,
                    scoreRedFoul: Match.scoreRedFoul,
                    scoreRedAuto: Match.scoreRedAuto,
                    scoreBlueFinal: Match.scoreBlueFinal,
                    scoreBlueFoul: Match.scoreBlueFoul,
                    scoreBlueAuto: Match.scoreBlueAuto,
                    redWins: Match.redWins,
                    blueWins: Match.blueWins,
                    randomization: randomization,
                    played: played,
                    teams: Teams,
                }
            schedule.push(newMatch);
        }
    }
} catch (err) {
    console.log(err)
}
try {
    // Fetch Hybrid PlayoffMatch Schedule from API
    const schedulePlayoffResponse = await fetch(apiSchedulePlayoffPath, {
        headers: headers
    })
    const schedulePlayoffData = await schedulePlayoffResponse.json()
    const schedulePlayoffSchedule = schedulePlayoffData.schedule
    if (schedulePlayoffSchedule.length < 1) {
        message.push("No Playoff Schedule Retrieved");
    } else {
        updated.foundPlayoffScores = true;
        for (let i = 0; i < schedulePlayoffSchedule.length; i++ ) {
            const Match = schedulePlayoffSchedule[i];
                        let red1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let red2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let blue1: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let blue2: Irobotperfomance = { autoLeave: false, teleBase: 'NONE', }
            let played: boolean = false;
            let randomization: number = 0;

            for (let j = 0; j < scores.length; j++ ) {
                if (scores[j].matchNumber === Match.series && 
                    scores[j].matchSeries === Match.matchNumber &&
                    scores[j].matchLevel === Match.tournamentLevel) {
                    randomization = scores[j].randomization;
                    played = true;
                    red1 = scores[j].Red1;
                    red2 = scores[j].Red2;
                    blue1 = scores[j].Blue1;
                    blue2 = scores[j].Blue2;
                    break;
                }
            }

            const Teams = []
            for (let j = 0; j < Match.teams.length; j++ ) {
                const Team = Match.teams[j];
                const station: string = Team.station;
                let autoLeave: boolean = false;
                let teleBase: string = 'NONE';

                if (station == 'Red1') { autoLeave = red1.autoLeave; teleBase = red1.teleBase; }
                if (station == 'Red2') { autoLeave = red2.autoLeave; teleBase = red2.teleBase; }
                if (station == 'Blue1') { autoLeave = blue1.autoLeave; teleBase = blue1.teleBase; }
                if (station == 'Blue2') { autoLeave = blue2.autoLeave; teleBase = blue2.teleBase; }

                const newTeam = {
                    teamNumber: Team.teamNumber,
                    station: Team.station,
                    surrogate: Team.surrogate,
                    noShow: Team.noShow,
                    dq: Team.dq,
                    onField: Team.onField,
                    teamName: Team.teamName,
                    autoLeave: autoLeave,
                    teleBase: teleBase,
                }
                Teams.push(newTeam);
            }
            const newMatch = 
                {
                    eventCode: eventCode,
                    matchLevel: Match.tournamentLevel,
                    matchNumber: Match.series,
                    matchSeries: Match.matchNumber,
                    description: Match.description,
                    startTime: Match.startTime,
                    actualStartTime: Match.actualStartTime,
                    postResultTime: Match.postResultTime,
                    scoreRedFinal: Match.scoreRedFinal,
                    scoreRedFoul: Match.scoreRedFoul,
                    scoreRedAuto: Match.scoreRedAuto,
                    scoreBlueFinal: Match.scoreBlueFinal,
                    scoreBlueFoul: Match.scoreBlueFoul,
                    scoreBlueAuto: Match.scoreBlueAuto,
                    redWins: Match.redWins,
                    blueWins: Match.blueWins,
                    randomization: randomization,
                    played: played,
                    teams: Teams,
                }
            schedule.push(newMatch);
        }
    }
} catch (err) {
    console.log(err)
}

try {
    await connectDB();

    for (let i = 0; i < schedule.length; i++ ) {
        const match = schedule[i];

        await ScheduleMatch.findOneAndUpdate({ eventCode: match.eventCode, matchLevel: match.matchLevel, matchNumber: match.matchNumber, matchSeries: match.matchSeries }, match, { upsert: true });
    }
    message.push("Schedule Updated");
    updated.savedMatches = true;
} catch (err) {
    console.log(err)
}

    const result = { updated: updated, message: message };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })

}