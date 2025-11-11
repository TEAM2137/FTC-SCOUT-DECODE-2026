import connectDB from "@/lib/db"
import Event from "@/models/ftc/Event"


interface IPerformanceSummary {
    teamNumber: string,
    teamName: string,
    wins: number,
    losses: number,
    ties: number,
    allianceFinal: number,
    allianceFoul: number,
    allianceAuto: number,
    refAuto: number,
    refBase: number,
    autoArtifacts: number,
    teleArtifacts: number,
    doubleBaseRaise: number,
    doubleBaseLift: number,
    score: number,
    totalArtifacts: number,
    scoutAutoLeave: number,
    scoutTeleBase: number,
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
}

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    await connectDB();
    const data = await Event.findOne({ eventCode: eventCode });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }




    const performanceSummary: IPerformanceSummary[] = []

    const res = await fetch (process.env.THIS_SERVER_URL + '/api/scout/performance/' + eventCode, {cache: 'force-cache', next: { revalidate: 60 }});
    const resData = await res.json();

    // Save Event Team Summaries
    for (let i = 0; i < data.teamList.length; i++ ) {
        const team = data.teamList[i];
        const tempTeam = []

        console.log('Processing Team: ' + team.teamNumber)

        let wins = 0;
        let losses = 0;
        let ties = 0;
        let allianceFinal = 0;
        let allianceFoul = 0;
        let allianceAuto = 0;
        let refAuto = 0;
        let refBase = 0;
        let autoArtifacts = 0;
        let teleArtifacts = 0;
        let doubleBaseRaise = 0;
        let doubleBaseLift = 0;
        let score = 0;
        let totalArtifacts = 0;
        let scoutAutoLeave = 0;
        let scoutTeleBasePartial = 0;
        let scoutTeleBaseFull = 0;



        for (let j = 0; j < resData.length; j++) {
            const record = resData[j]

            if (record.teamNumber === team.teamNumber && record.matchLevel === 'QUALIFICATION') {
                tempTeam.push(record)
            }
        }
        
        if (tempTeam.length > 0) {
            for (let j = 0; j < tempTeam.length; j++) {
                const match = tempTeam[j];

                //console.log('Processing Match: '  + match.matchLevel + ' ' + match.matchNumber)

                wins += match.allianceWon;
                losses += match.allianceLost;
                ties += match.allianceTied;

                allianceFinal += match.allianceFinal;
                allianceFoul += match.allianceFoul;
                allianceAuto += match.allianceAuto;

                refAuto += match.autoLeave;
                if (match.teleBase === 'FULL') {
                    refBase += 10;
                } else if (match.teleBase === 'PARTIAL') {
                    refBase += 5;
                }

                autoArtifacts += match.autoArtifacts;
                teleArtifacts += match.teleArtifacts;
                doubleBaseRaise += match.doubleBaseRaise;
                doubleBaseLift += match.doubleBaseLift;
                score += match.score;
                totalArtifacts += match.totalArtifacts;
                scoutAutoLeave += match.scoutAutoLeave;
                scoutTeleBasePartial += match.scoutTeleBasePartial;
                scoutTeleBaseFull += match.scoutTeleBaseFull;
            }
        }

        const numerator = tempTeam.length

        const newPerformanceSummary = {
            teamNumber: team.teamNumber,
            teamName: team.nameShort,
            wins: wins,
            losses: losses,
            ties: ties,
            allianceFinal: Math.floor(allianceFinal / numerator),
            allianceFoul: Math.floor(allianceFoul / numerator),
            allianceAuto: Math.floor(allianceAuto / numerator),
            refAuto: (refAuto / numerator),
            refBase: (refBase / numerator),
            autoArtifacts: (autoArtifacts / numerator),
            teleArtifacts: (teleArtifacts / numerator),
            doubleBaseRaise: (doubleBaseRaise / numerator),
            doubleBaseLift: (doubleBaseLift / numerator),
            score: (score / numerator),
            totalArtifacts: (totalArtifacts / numerator),
            scoutAutoLeave: (scoutAutoLeave / numerator),
            scoutTeleBase: ((scoutTeleBasePartial + scoutTeleBaseFull) / numerator),
        }

        performanceSummary.push(newPerformanceSummary);

    }

  return new Response(JSON.stringify(performanceSummary), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}