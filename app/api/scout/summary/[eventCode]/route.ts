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
    scoutedMatches: number,
}

interface IRankings 
{
    _id: string,
    _v: number,
    eventCode: string,
    rank: number,
    teamNumber: number,
    teamName: string,
    sortOrder1: number,
    sortOrder2: number,
    sortOrder3: number,
    sortOrder4: number,
    sortOrder5: number,
    sortOrder6: number,
    wins: number,
    losses: number,
    ties: number,
    qualAverage: number,
    dq: number,
    matchesPlayed: number,
    matchesCounted: number,
}

export async function GET( request: Request, { params }: { params: Promise<{ eventCode: string, }> } ) {
    const eventCode = (await params).eventCode
    await connectDB();
    const data = await Event.findOne({ eventCode: eventCode });
    if (data === null) {
        return new Response('Event not found', { status: 404 })
    }




    const performanceSummary: IPerformanceSummary[] = []

    const res = await fetch (process.env.THIS_SERVER_URL + '/api/scout/performance/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }});
    const perfData = await res.json();

    const resRankings = await fetch (process.env.THIS_SERVER_URL + '/api/scout/rankings/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }});
    const rankData = await resRankings.json();

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
        let scoutedMatches = 0;



        for (let j = 0; j < perfData.length; j++) {
            const record = perfData[j]
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
                scoutedMatches += match.scouted;
            }
        }

        const ranking = rankData.filter((rank: IRankings) => rank.teamNumber === team.teamNumber);
        const rankNumber = ranking[0].rank;
        const rankingWins = ranking[0].wins;
        const rankingLosses = ranking[0].losses;
        const rankingTies = ranking[0].ties;
        const rankingMatchesCounted = ranking[0].matchesCounted;
        const rankingMatchesPlayed = ranking[0].matchesPlayed;
        const rankingQualAverage = ranking[0].qualAverage;
        const rankingDQ = ranking[0].dq;
        const rankingSortOrder1 = ranking[0].sortOrder1;
        const rankingSortOrder2 = ranking[0].sortOrder2;
        const rankingSortOrder3 = ranking[0].sortOrder3;
        const rankingSortOrder4 = ranking[0].sortOrder4;
        const rankingSortOrder5 = ranking[0].sortOrder5;
        const rankingSortOrder6 = ranking[0].sortOrder6;


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
            autoArtifacts: (autoArtifacts / scoutedMatches),
            teleArtifacts: (teleArtifacts / scoutedMatches),
            doubleBaseRaise: (doubleBaseRaise / scoutedMatches),
            doubleBaseLift: (doubleBaseLift / scoutedMatches),
            score: (score / scoutedMatches),
            totalArtifacts: (totalArtifacts / scoutedMatches),
            scoutAutoLeave: (scoutAutoLeave / scoutedMatches),
            scoutTeleBase: ((scoutTeleBasePartial + scoutTeleBaseFull) / scoutedMatches),
            scoutedMatches: scoutedMatches,
            rRank: rankNumber,
            rWins: rankingWins,
            rLosses: rankingLosses,
            rTies: rankingTies,
            rMatchesCounted: rankingMatchesCounted,
            rMatchesPlayed: rankingMatchesPlayed,
            rQualAverage: rankingQualAverage,
            rDQ: rankingDQ,
            rRankPoints: rankingSortOrder1,
            rMatchPoints: rankingSortOrder2,
            rBasePoints: rankingSortOrder3,
            rAutoPoints: rankingSortOrder4,
            rSortOrder5: rankingSortOrder5,
            rHighScore: rankingSortOrder6,
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