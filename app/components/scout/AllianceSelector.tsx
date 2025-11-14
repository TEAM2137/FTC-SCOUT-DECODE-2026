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

interface IAllainces {
    aOne: {
        teamNumber: number,
        teamName: string,
    }
    aTwo: {
        teamNumber: number,
        teamName: string,
    }
    aThree: {
        teamNumber: number,
        teamName: string,
    }
    aFour: {
        teamNumber: number,
        teamName: string,
    }
    aFive: {
        teamNumber: number,
        teamName: string,
    }
    aSix: {
        teamNumber: number,
        teamName: string,
    },
}


const AllianceSelector = ({ eventCode }: { eventCode: string}) => {
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
    const [alliances, setAlliances] = useState<number[]>([])


    
    
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
            const filterdPD = sortedPD.filter((team: IPerformanceSummary) => !alliances.includes(team.teamNumber));
            setPerformanceData(filterdPD);
        }
    }, [sortedPD, performanceData, reload]);

    useEffect(() => { 
        //console.log(alliances);
    },[alliances]);



  return (
    <div className="flex flex-row w-[98%] m-4">
        {!performanceData.length &&  <Loading /> }
        {performanceData.length > 0 &&

        <Card className="bg-primary text-primary-foreground p-2 rounded-lg w-19/20">
        <CardHeader className="items-center pt-4">
            <CardTitle>Alliances</CardTitle>
            <CardDescription>
                
               <div className="flex flex-col justify-between text-xs">

                {alliances[0] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">ONE</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[0]}</span>
                </div>
                {alliances[1] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[1]}</span>
                </div>}
               </div>}

                {alliances[2] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">TWO</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[2]}</span>
                </div>
                {alliances[3] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[3]}</span>
                </div>}
               </div>}
  
                {alliances[4] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">THREE</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[4]}</span>
                </div>
                {alliances[5] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[5]}</span>
                </div>}
               </div>}

                {alliances[6] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">FOUR</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[6]}</span>
                </div>
                {alliances[7] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[7]}</span>
                </div>}
               </div>}


                {alliances[8] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">FIVE</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[8]}</span>
                </div>
                {alliances[9] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[9]}</span>
                </div>}
               </div>}

                {alliances[10] > 0 &&<div className="flex flex-row p-1 rounded-lg   w-full">
                <p className="text-center text-sm">SIX</p>
                 <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                Captain: <span className="text-lg text-center">{alliances[10]}</span>
                </div>
                {alliances[11] > 0 && <div className="bg-gray-950 rounded-lg p-1 m-1 w-full text-white text-xs">
                1st Pick: <span className="text-lg text-center">{alliances[11]}</span>
                </div>}
               </div>}

               </div>


                {alliances[0] > 0 && 
                <button className="p-1 m-1 text-right text-xs bg-blue-950 text-white rounded-sm w-full" onClick={() => setAlliances( (prevArray) => prevArray.slice(0, -1) )}>UNDO SELECTION</button>
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
        
                <p>Ranked Teams: {ranked} | Scouted Teams: {scouted}</p>
                <p>Sorted by: 
                <button className="p-1 m-1 text-right text-xs bg-green-900 text-white rounded-sm" onClick={() => setSortBy('artifacts')}>Scouting</button>
                <button className="p-1 m-1 text-right text-xs bg-blue-900 text-white rounded-sm" onClick={() => setSortBy('rank')}>Rank Points</button>
                <button className="p-1 m-1 text-right text-xs bg-red-900 text-white rounded-sm" onClick={() => setSortBy('matchpoints')}>Alliance Scores</button>
                </p>


            {performanceData.filter((team: IPerformanceSummary) => !alliances.includes(team.teamNumber)).map((team, i: number) => (
            <button key={i} className=" bg-slate-950 rounded-full m-2" onClick={() => setAlliances((prevArray) => [...prevArray, team.teamNumber]) }>
            <div  className="grid grid-cols-[25px_60px_30px_30px_30px_30px_30px_30px_30px_30px_2px] gap-1 py-1">
                <div className="col-start-1 w-full p-1 text-center text-sm font-bold bg-blue-950 rounded-full">{i+1}</div>
                <div className="col-start-2 text-left text-lg">
                   <span className="font-bold" >{team.teamNumber}</span>
                </div>
                <div className="col-start-3 text-center text-sm bg-green-950">{Math.floor((team.totalArtifacts*3)+team.scoutAutoLeave+team.scoutTeleBase)}</div>
                <div className="col-start-4 text-center text-sm">{Math.floor(team.totalArtifacts)}</div>
                <div className="col-start-5 text-center text-sm">{Math.floor(team.scoutAutoLeave)}</div>
                <div className="col-start-6 text-center text-sm">{Math.floor(team.scoutTeleBase)}</div>
                <div className="col-start-7 text-center text-sm bg-blue-950">{team.rRankPoints}</div>
                <div className="col-start-8 text-center text-sm bg-red-950">{team.rMatchPoints}</div>
                <div className="col-start-9 text-center text-sm">{team.rAutoPoints}</div>
                <div className="col-start-10 text-center text-sm">{team.rBasePoints}</div>
            </div>
            </button>
            ))}


        </CardContent>
        <CardFooter className="flex-row gap-2 text-sm place-items-start justify-items-start">
        
        <div className="flex items-center gap-2 leading-none font-medium text-xs m-auto w-1/3">
        <div className="flex flex-col">
                <div className="p-1  text-right text-sm bg-green-950">Average Scouted Score</div>
                <div className="p-1  text-right text-sm font-light">Average Artifacts</div>
                <div className="p-1  text-right text-sm font-light">Average Auto Score</div>
                <div className="p-1  text-right text-sm font-light">Average Base Score</div>
        </div>
        </div>


        <div className="flex items-center gap-2 leading-none font-medium text-xs m-auto w-fill">
        <div className="flex flex-col">
                <div className="p-1 text-center text-sm bg-blue-950">Ranking Points<br/>&nbsp;</div>
                <div className="p-1  text-right text-sm font-light">&nbsp;</div>
                <div className="p-1  text-right text-sm font-light">&nbsp;</div>
                <div className="p-1  text-right text-sm font-light">&nbsp;</div>

        </div>
        </div>

        <div className="flex items-center gap-2 leading-none font-medium text-xs m-auto w-1/3">
        <div className="flex flex-col">
                <div className="p-1  text-left text-sm bg-red-950">Alliance Match Points</div>
                <div className="p-1  text-left text-sm font-light">Alliance Auto</div>
                <div className="p-1  text-left text-sm font-light">Alliance Base</div>
                <div className="p-1  text-left text-sm font-light">&nbsp;</div>
        </div>
        </div>

        </CardFooter>
        </Card>
     }
    


    </div>
  )
}

export default AllianceSelector