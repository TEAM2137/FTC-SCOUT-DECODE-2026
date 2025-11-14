"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { useState, useEffect, use } from 'react';
import Loading from '../ui/Loading';
import { set } from "mongoose";



interface IPerformanceSummary {
    teamNumber: number,
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
    rRank: number,
    rWins: number,
    rLosses: number,
    rTies: number,
    rMatchesCounted: number,
    rMatchesPlayed: number,
    rQualAverage: number,
    rDQ: number,
    rRankPoints: number,
    rMatchPoints: number,
    rBasePoints: number,
    rAutoPoints: number,
    rSortOrder5: number,
    rHighScore: number,
}

interface IChartRowData 
{
    teamNumber: string,
    teamName: string,
    allianceFinal: number,
    totalArtifacts: number,
    rank: number,
    rankPoints: number,
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

const SummaryTable = ({ eventCode }: { eventCode: string}) => {
    const [performanceData, setPerformanceData] = useState<IPerformanceSummary[]>([]);
    const [sortedPD, setSortedPD] = useState<IPerformanceSummary[]>([]);
    const [reload, setReload] = useState<boolean>(false);
    const [scouted, setScouted] = useState<number>(0);
    const [ranked, setRanked] = useState<number>(0);
    const [maxAllianceFinal, setMaxAllianceFinal] = useState<number>(0);
    const [minAllianceFinal, setMinAllianceFinal] = useState<number>(0);
    const [maxTotalArtifacts, setMaxTotalArtifacts] = useState<number>(0);
    const [minTotalArtifacts, setMinTotalArtifacts] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>('rank');
    
    function processData( performanceData: IPerformanceSummary[]) {
        let scouted = 0;
        let ranked = 0;
        let maxTotalArtifacts = 0;
        let minTotalArtifacts = 0;
        let maxAllianceFinal = 0;
        let minAllianceFinal = 0;

        for (let i = 0; i < performanceData.length; i++ ) {
            const summary = performanceData[i];
            if (summary.totalArtifacts > maxTotalArtifacts || i === 0) { maxTotalArtifacts = summary.totalArtifacts; }
            if (summary.totalArtifacts < minTotalArtifacts || i === 0) { minTotalArtifacts = summary.totalArtifacts; }
            if (summary.scoutedMatches > 0) { scouted++; }
            if (summary.rMatchPoints > maxAllianceFinal || i === 0) { maxAllianceFinal = summary.allianceFinal; }
            if (summary.rMatchPoints < minAllianceFinal || i === 0) { minAllianceFinal = summary.allianceFinal; }
            if (summary.rRank > 0) { ranked++; }
        }
        setMaxTotalArtifacts(Math.floor(maxTotalArtifacts));
        setMinTotalArtifacts(minTotalArtifacts);
        setScouted(scouted);
        setMaxAllianceFinal(maxAllianceFinal);
        setMinAllianceFinal(minAllianceFinal);
        setRanked(ranked);


    }



    useEffect(() => {
        fetch('/api/scout/summary/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }})
        .then(res => res.json())
        .then(data => {
            data.sort((a: IPerformanceSummary, b: IPerformanceSummary) => a.rRank - b.rRank);
            processData(data);
            setPerformanceData(data);
        })
        .catch(err => console.log(err));

    }, []);

    useEffect(() => {
        if (sortBy === 'matchpoints') {
            setSortedPD(performanceData.sort((a: IPerformanceSummary, b: IPerformanceSummary) => b.rMatchPoints - a.rMatchPoints))
        }
        if (sortBy === 'artifacts') {
            setSortedPD(performanceData.sort((a: IPerformanceSummary, b: IPerformanceSummary) => b.totalArtifacts - a.totalArtifacts))
        }
        if (sortBy === 'rank') {
            setSortedPD(performanceData.sort((a: IPerformanceSummary, b: IPerformanceSummary) => a.rRank - b.rRank))
        }
        setReload(true);
    }, [sortBy]);

    useEffect(() => {
        if (reload) {
            setReload(false);
            setPerformanceData(sortedPD);
        }
    }, [sortedPD, performanceData, reload]);

  return (
    <div className="flex flex-row w-[98%] m-4">
        {!performanceData.length &&  <Loading /> }
        {performanceData.length > 0 &&

        <Card className="bg-primary text-primary-foreground p-2 rounded-lg">
        <CardHeader className="items-center pt-4">
            <CardTitle>Team Perfomance <br/>
            <span className="text-xs forn-normal">(Rank vs. Allaince Match Points vs. Scouted Artifacts)</span></CardTitle>
            <CardDescription>
               <p>Ranked Teams: {ranked} | Scouted Teams: {scouted}</p>
               <p>Sorted by: 
                <button className="p-1 m-1 text-right text-xs bg-blue-500 text-white rounded-sm" onClick={() => setSortBy('artifacts')}>Artifacts</button>
                <button className="p-1 m-1 text-right text-xs bg-blue-500 text-white rounded-sm" onClick={() => setSortBy('rank')}>TEAM Rank</button>
                <button className="p-1 m-1 text-right text-xs bg-blue-500 text-white rounded-sm" onClick={() => setSortBy('matchpoints')}>Match Points</button></p>
            </CardDescription>
        </CardHeader>
        <CardContent>
        
            <div>
            <div className="grid grid-cols-[20px_100px_100px_100px] gap-1 py-1">
                
                <button className="col-start-2 py-1 text-right text-xs">SCOUTED<br/>Avg Artifacts</button>

                <button className="col-start-3 py-1 text-center text-xs">TEAM<br/>(Rank Points)</button>

                <button className="col-start-4 py-1 text-left text-xs">FMS ALLIANCE<br/>Avg Match Points</button>

            </div>


            {performanceData.map((team, i: number) => (
            
            <div key={i} className="grid grid-cols-[20px_120px_100px_120px] gap-1 py-1">
                <div className="col-start-1 py-1 text-center text-sm font-bold">{i+1}</div>

                <div className="col-start-2 py-1 justify-items-end">

                <div key={i+'sum'} style={{ width: `${((team.totalArtifacts / maxTotalArtifacts)*100)+15}px` }} className={'ml-auto bg-slate-500 h-full p-1 rounded-sm text-right'}>
                    {Math.floor(team.totalArtifacts)}</div>
                </div>
                <div className="col-start-3 py-2 text-center text-xs">
                   <span className="font-bold text-lg">{team.teamNumber}</span> ({team.rRankPoints})
                </div>
                <div className="col-start-4 py-1 ">
                    <div style={{ width: `${((team.rMatchPoints / maxAllianceFinal)*100)+15}px` }} className={' bg-slate-500 h-full p-1 rounded-sm'}>
                    {team.rMatchPoints}</div>
                </div>
            </div>
            ))}

            </div>
        </CardContent>
        </Card>
     }
    


    </div>
  )
}

export default SummaryTable