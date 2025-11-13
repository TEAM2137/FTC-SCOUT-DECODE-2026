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

const SummaryGraph = ({ eventCode }: { eventCode: string}) => {
    const [performanceData, setPerformanceData] = useState<IPerformanceSummary[]>([]);
    const [chartData, setChartData] = useState<IChartRowData[]>([]);
    const [rankings, setRankings] = useState<IRankings[]>([]);
    const [reloadChart, setReloadChart] = useState<boolean>(false);
    const [scouted, setScouted] = useState<number>(0);
    const [ranked, setRanked] = useState<number>(0);
    const [maxAllianceFinal, setMaxAllianceFinal] = useState<number>(0);
    const [minAllianceFinal, setMinAllianceFinal] = useState<number>(0);
    const [maxTotalArtifacts, setMaxTotalArtifacts] = useState<number>(0);
    const [minTotalArtifacts, setMinTotalArtifacts] = useState<number>(0);
    

    useEffect(() => {
        fetch('/api/scout/summary/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }})
        .then(res => res.json())
        .then(data => {
            data.sort((a: IPerformanceSummary, b: IPerformanceSummary) => a.teamNumber - b.teamNumber);
            setPerformanceData(data);
        })
        .catch(err => console.log(err));

        fetch('/api/scout/rankings/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }})
            .then(res => res.json())
            .then(data => {
                const tempRankings: IRankings[] = data.sort((a: IRankings, b: IRankings) => a.rank - b.rank);
                for (let i = 1; i < tempRankings.length; i++ ) {
                    const ranking = tempRankings[i];
                    if (ranking.rank === tempRankings[i-1].rank) {
                        //skip the duplicate
                        tempRankings.splice(i, 1);
                        i--;
                    }
                }
                setRankings(tempRankings);
            })
            .catch(err => console.log(err));

    }, []);

    useEffect(() => {
        function processData() {
            let scouted = 0;
            let maxTotalArtifacts = 0;
            let minTotalArtifacts = 0;
            for (let i = 0; i < performanceData.length; i++ ) {
                const summary = performanceData[i];
                if (summary.totalArtifacts > maxTotalArtifacts || i === 0) { maxTotalArtifacts = summary.totalArtifacts; }
                if (summary.totalArtifacts < minTotalArtifacts || i === 0) { minTotalArtifacts = summary.totalArtifacts; }
                if (summary.scoutedMatches > 0) { scouted++; }
            }
            setMaxTotalArtifacts(Math.floor(maxTotalArtifacts));
            setMinTotalArtifacts(minTotalArtifacts);
            setScouted(scouted);
        }
        if (performanceData.length > 0) {
            processData();
        }
    }, [performanceData]);

    useEffect(() => {
        function processData() {
            
            setRanked(rankings.length);
            let maxAllianceFinal = 0;
            let minAllianceFinal = 0;
            for (let i = 0; i < rankings.length; i++ ) {
                const rank = rankings[i];
                if (rank.sortOrder2 > maxAllianceFinal || i === 0) { maxAllianceFinal = rank.sortOrder2; }
                if (rank.sortOrder2 < minAllianceFinal || i === 0) { minAllianceFinal = rank.sortOrder2; }
               
            }
            setMaxAllianceFinal(maxAllianceFinal);
            setMinAllianceFinal(minAllianceFinal);
        }
        if (rankings.length > 0) {
            processData();
        }
    }, [rankings]);


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
            </CardDescription>
        </CardHeader>
        <CardContent>
        
            <div>
            <div className="grid grid-cols-[120px_120px_120px] gap-1 py-1">
                <div className="col-start-1 py-1 text-right text-xs">SCOUTED<br/>Avg Artifacts</div>
                <div className="col-start-2 py-1 text-center text-xs">TEAM<br/>(Rank Points)</div>
                <div className="col-start-3 py-1 text-left text-xs">FMS ALLIANCE<br/>Avg Match Points</div>
            </div>


            {rankings.map((ranking, i: number) => (
            <div key={i} className="grid grid-cols-[120px_120px_120px] gap-1 py-1">
                <div className="col-start-1 py-1 justify-items-end">

 {performanceData.length > 0 && <>
                    
                    {performanceData.filter((summary) => summary.teamNumber === ranking.teamNumber).map((summary, i: number) => (
                      
                      <div key={i+'sum'} style={{ width: `${((summary.totalArtifacts / maxTotalArtifacts)*100)+15}px` }} className={' bg-slate-500 h-full p-1 rounded-sm text-right'}>
                    {Math.floor(summary.totalArtifacts)}</div>
                    ))}
                    
                    </>}

               
                </div>
                <div className="col-start-2 py-2 text-center text-xs">
                   {ranking.rank}: <span className="font-bold text-lg">{ranking.teamNumber}</span> ({ranking.sortOrder1})
                </div>
                <div className="col-start-3 py-1 ">
                    <div style={{ width: `${((ranking.sortOrder2 / maxAllianceFinal)*100)+15}px` }} className={' bg-slate-500 h-full p-1 rounded-sm'}>
                    {ranking.sortOrder2}</div>
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

export default SummaryGraph