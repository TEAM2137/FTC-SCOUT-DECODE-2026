'use client'

import { useState, useEffect } from 'react';
import Loading from '../ui/Loading';



interface IRankings {
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


const Rankings = ({ eventCode }: { eventCode: string}) => {
    const [rankings, setRankings] = useState<IRankings[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [rankingsLoaded, setRankingsLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/scout/rankings/' + eventCode)
        .then(res => res.json())
        .then(data => {
            data.sort((a: IRankings, b: IRankings) => a.rank - b.rank);
            setRankings(data);
            setRankingsLoaded(true);
        })
        .catch(err => console.log(err));
    }, []);

  return (
    <div className="my-4">

{!rankingsLoaded &&  <Loading /> }

{rankings.length > 0 &&

    <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
    <h1 className="p-2 font-bold">Qualification Rankings</h1>
    <div className="w-full h-full bg-slate-50 text-gray-900 p-1">

        

        <div>
            
            <div className="grid grid-cols-[50px_80px_1fr_50px] sm:grid-cols-[50px_80px_1fr_50px_50px_50px_50px_50px] gap-1 py-1 border-b border-slate-300">
                <div className="text-xs text-center">RANK</div>
                <div className="text-xs text-center col-span-2">TEAM</div>
                <div className="text-xs text-center">RP</div>
                <div className="hidden sm:block text-xs text-center">MP</div>
                <div className="hidden sm:block text-center text-xs">BS</div>
                <div className="hidden sm:block text-center text-xs">AS</div>
                <div className="hidden sm:block text-center text-xs">W | L | T</div>
            </div>
        
        
        </div>   
    {rankings.map((ranking, i: number) => (
        <div key={i} className={!showMore && i > 5 ? 'hidden' : 'block'}>
            
            <div className="grid grid-cols-[50px_80px_1fr_50px] sm:grid-cols-[50px_80px_1fr_50px_50px_50px_50px_50px] gap-1 py-1 border-b border-slate-300 hover:bg-sky-100">
                <div className="font-bold text-center text-sm md:text-lg justify-center my-auto">{ranking.rank}</div>
                <div className="font-bold text-center text-sm md:text-xl justify-center my-auto">{ranking.teamNumber}</div>
                <div className="text-left text-xs md:text-lg justify-center my-auto">{ranking.teamName}</div>
                <div className="text-center">{ranking.sortOrder1}</div>
                <div className="hidden sm:block text-center text-xs">{ranking.sortOrder2}</div>
                <div className="hidden sm:block text-center text-xs">{ranking.sortOrder3}</div>
                <div className="hidden sm:block text-center text-xs">{ranking.sortOrder4}</div>
                <div className="hidden sm:block text-center text-xs">{ranking.wins} | {ranking.losses} | {ranking.ties}</div>
            </div>
        
        
        </div>
    ))}
    </div>
    {!showMore && <button className="text-xs font-bold bg-neutral-800 rounded-lg m-2" onClick={() => setShowMore(true)}>SHOW MORE</button>}
    {showMore && <button className="text-xs font-bold bg-neutral-800 rounded-lg m-2" onClick={() => setShowMore(false)}>SHOW LESS</button>}
    </div>

}

    </div>
  )
}


export default Rankings