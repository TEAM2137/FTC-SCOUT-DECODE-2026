'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Loading from '../ui/Loading';

interface IEventItem
{
    eventCode: string,
    divisionCode: string,
    name: string,
    published: boolean,
    typeName: string,
    regionCode: string,
    leagueCode: string,
    districtCode: string,
    venue: string,
    city: string,
    stateprov: string,
    country: string,
    website: string,
    liveStreamUrl: string,
    weekStart: string,
    dateStart: string,
    dateEnd: string,
    teamList: [
    {
        teamNumber: number,
        nameShort: string,
        city: string,
        stateProv: string,
        country: string,
    },
    ],
}


export default function Event({ eventCode }: { eventCode: string}) {
  const [event, setEvent] = useState<IEventItem>();
  const [eventLoaded, setEventLoaded] = useState<boolean>(false);
  const [showTeams, setShowTeams] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/scout/events/' + eventCode, {cache: 'force-cache', next: { revalidate: 3600 }})
    .then(res => res.json())
    .then(data => {
        setEvent(data);
        setEventLoaded(true);
    })
    .catch(err => console.log(err));
  }, [eventCode]);


  return (
    <div >
        {!eventLoaded &&  <Loading /> }

        {event &&
        
    <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
        <div className="flex flex-row justify-between">
        <h1 className="p-2 font-bold">Teams Participating ({event.teamList.length})</h1>
            <button className="m-2" onClick={() => setShowTeams(!showTeams)}>
                {showTeams ? 
                <Image src="/icons/orange-up.svg" alt="up"width={20} height={20} />
                : 
                <Image src="/icons/orange-down.svg" alt="down" width={20} height={20} />
                } 
            </button>
        </div>

    {showTeams &&
    <div className="w-full h-full bg-slate-50 text-gray-800 p-1 rounded-b-lg">
  
    {event.teamList.map((team, i: number) => (
        <div key={i} className="block">
            
            <div className="grid grid-cols-[80px_1fr_1fr] sm:grid-cols-[80px_1fr_1fr] gap-1 py-1 border-b border-neutral-200 hover:bg-sky-100">
                <div className="text-center font-bold">{team.teamNumber}</div>
                <div className="text-Left">{team.nameShort}</div>
                <div className="text-left text-xs">{team.city}, {team.stateProv}, {team.country}</div>
            </div>
        
        
        </div>
    ))}
    </div>
    }

    </div>

}
        
    </div>
  )
}
