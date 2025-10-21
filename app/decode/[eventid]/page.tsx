'use client'
import { use, useEffect, useState } from 'react'

interface EventItem 
    {
        code: string,
        regionCode: string,
        name: string,
        typeName: string,
        city: string,
        stateprov: string,
        country: string,
        weekStart: string,
        dateStart: string,
        dateEnd: string,
        teamsCount: number,
        teamsList: [
            {
                teamNumber: number,
                nameShort: string,
                schoolName: string,
                city: string,
                stateProv: string,
                country: string,
            }
        ],
    }

    function returnDate(date: string) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        return month + "/" + day+ "/" + year;
    }


export default function Page({ params, }: { params: Promise<{ eventid: string }>}){
    const { eventid } = use(params)
    const [event, setEvent] = useState<EventItem>({code: 'loading', regionCode: '', name: '', typeName: '', city: '', stateprov: '', country: '', weekStart: '', dateStart: '', dateEnd: '', teamsCount: 0, teamsList: [{teamNumber: 0, nameShort: '', schoolName: '', city: '', stateProv: '', country: ''},]});

    useEffect(() => {
        fetch(`/api/decode/events/${eventid}`)
        .then(res => res.json())
        .then(data => {
            setEvent(data);
        })
        .catch(err => console.log(err));
    }, []);




  return (
    <div className='text-black p-2'>
        <h1 className="text-2xl font-black">{event.name}</h1>
        <p className="text-sm font-normal">{event.typeName} | {event.city}, {event.stateprov}, {event.country} | 
            {returnDate(event.dateStart)} to {returnDate(event.dateEnd)}</p>
        <p className="text-sm font-normal">{event.teamsList.length} Teams Participating</p>
        <div className="flex flex-row gap-1 flex-wrap">
            {event.teamsList.map((team, index: number) => (
                <div key={index} className="flex flex-col w-[100%] sm:w-[48%] lg:w-[33%] xl:w-[24%] p-1">

                    <div className="flex flex-col bg-slate-600 rounded-lg p-1 shadow-lg">
                        <h2 className="text-sm font-bold text-slate-200 pl-2">TEAM {team.teamNumber}</h2>
                        <div className="flex flex-row gap-2 p-2 w-[100%] bg-slate-100 mb-1 rounded-md">
                            <div className="min-w-[12%]"><div className="text-xs font-light bg-slate-900 rounded-lg p-0.5 text-white text-center">{team.teamNumber}</div></div>
                            <div className="text-sm font-bold">{team.nameShort}</div>
                            <div className="text-xs font-normal">{team.schoolName}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
    </div>
  )
}

