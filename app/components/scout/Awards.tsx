'use client'

import { useState, useEffect } from 'react';
import Loading from '../ui/Loading';



interface IAwards {
    awardId: number,
    sortId: number,
    teamId: number,
    teamProfileId: number,
    eventId: number,
    eventDivisionId: number,
    eventCode: string,
    name: string,
    series: number,
    teamNumber: number,
    teamName: string,
    schoolName: string,
    fullTeamName: string,
    person: string,
    }



const Awards = ({ eventCode }: { eventCode: string}) => {
    const [awards, setAwards] = useState<IAwards[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [awardsLoaded, setAwardsLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/scout/awards/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }})
        .then(res => res.json())
        .then(data => {
            data.sort((a: IAwards, b: IAwards) => a.series - b.series).sort((a: IAwards, b: IAwards) => a.sortId - b.sortId);
            setAwards(data);
            setAwardsLoaded(true);
        })
        .catch(err => console.log(err));
    }, []);

  return (
    <div className="my-4">

{!awardsLoaded &&  <Loading /> }

{awards.length > 0 &&

    <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
    <h1 className="p-2 font-bold">Event Awards</h1>
    <div className="w-full h-full bg-slate-50 text-gray-900 p-1">

        

        <div>
            
            <div className="grid grid-cols-[1fr_80px_1fr] sm:grid-cols-[1fr_80px_1fr_1fr] gap-1 py-1 border-b border-slate-300">
                <div className="text-xs text-center">AWARD</div>
                <div className="text-xs text-center col-span-2">TEAM</div>
                <div className="hidden sm:block text-xs text-center">FULL TEAM NAME</div>
            </div>
        
        
        </div>   
    {awards.filter((award: IAwards) => award.teamNumber).map((award, i: number) => (
        <div key={i} className={!showMore && i > 4 ? 'hidden' : 'block'}>
            
            <div className="grid grid-cols-[1fr_80px_1fr] sm:grid-cols-[1fr_80px_1fr_1fr] gap-1 py-1 border-b border-slate-300 hover:bg-sky-100">
                <div className="font-bold text-right text-xs sm:text-sm md:text-sm justify-center my-auto">{award.name}</div>
                <div className="font-bold text-center text-sm md:text-xl justify-center my-auto">{award.teamNumber}</div>
                <div className="font-normal text-left text-sm md:text-lg justify-center my-auto">{award.teamName}</div>
                <div className="hidden sm:block text-left text-xs md:text-sm">{award.fullTeamName}</div>
            </div>
        
        
        </div>
    ))}
    </div>
    {!showMore && <button className="text-xs md:text-lg font-bold bg-neutral-800 rounded-lg m-2" onClick={() => setShowMore(true)}>SHOW MORE</button>}
    {showMore && <button className="text-xs md:text-lg font-bold bg-neutral-800 rounded-lg m-2" onClick={() => setShowMore(false)}>SHOW LESS</button>}
    </div>

}

    </div>
  )
}


export default Awards