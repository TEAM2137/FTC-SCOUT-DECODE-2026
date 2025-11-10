'use client'

import { useState, useEffect } from 'react';
import Loading from '../ui/Loading';



interface IAlliance 
    {
    eventCode: string,
    number: number,
    name: string,
    captain: number,
    captainDisplay: string,
    round1: number,
    round1Display: string,
    round2: number,
    round2Display: string,
    round3: number,
    backup: number,
    backupReplaced: number
    }



const Alliances = ({ eventCode }: { eventCode: string}) => {
    const [alliances, setAlliances] = useState<IAlliance[]>([]);
    const [alliancesLoaded, setAlliancesLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/scout/alliances/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }} )
        .then(res => res.json())
        .then(data => {
            data.sort((a: IAlliance, b: IAlliance) => a.number - b.number)
            setAlliances(data);
            setAlliancesLoaded(true);
        })
        .catch(err => console.log(err));
    }, []);

  return (
    <div className="my-4">

{!alliancesLoaded &&  <Loading /> }

{alliances.length > 0 &&

    <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
    <h1 className="p-2 font-bold">Playoff Alliances</h1>
    <div className="w-full h-full bg-slate-50 text-gray-900 p-1">

        

        <div>
            
            <div className="grid grid-cols-[50px_80px_1fr_80px_1fr] sm:grid-cols-[50px_80px_1fr_80px_1fr] gap-1 py-1 border-b border-slate-300">
                <div className="text-xs text-center">ALLIANCE</div>
                <div className="text-xs text-center col-span-2">Captain</div>
                <div className="text-xs text-center col-span-2">1st PICK</div>
            </div>
        
        
        </div>   
    {alliances.map((alliance, i: number) => (
        <div key={i} className='block'>
            
            <div className="grid grid-cols-[50px_80px_1fr_80px_1fr] sm:grid-cols-[50px_80px_1fr_80px_1fr] gap-1 py-1 border-b border-slate-300 hover:bg-sky-100">
                <div className="font-bold text-center text-sm md:text-lg justify-center my-auto">{alliance.number}</div>
                <div className="font-bold text-center text-sm md:text-xl justify-center my-auto">{alliance.captain}</div>
                <div className="text-left text-xs md:text-sm">{alliance.captainDisplay}</div>
                <div className="font-bold text-center text-sm md:text-xl justify-center my-auto">{alliance.round1}</div>
                <div className="text-left text-xs md:text-sm">{alliance.round1Display}</div>
            </div>
        
        
        </div>
    ))}
    </div>
    
    </div>

}

    </div>
  )
}


export default Alliances