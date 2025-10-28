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




  return (<>
{event.code === 'loading' ? (
            <p>Loading teams...</p>
) : (
    <div className='text-black p-2 w-[100%]'>
        <h1 className="text-2xl font-black">{event.name}</h1>
        <p className="text-sm font-normal">{event.typeName} | {event.city}, {event.stateprov}, {event.country} | 
            {returnDate(event.dateStart)} to {returnDate(event.dateEnd)}</p>
        
        <div className="flex flex-row flex-wrap gap-1 w-[100%] bg-slate-800 mt-4 rounded-md">
            <h2 className="text-sm font-bold text-white ml-2 text-left w-[100%]">{event.teamsList.length} Teams Participating</h2>

            <div className="flex flex-row flex-wrap gap-1 w-[100%] p-1 items-center justify-center">

                {event.teamsList.map((team, index: number) => (
                    <div key={index} className="flex flex-row gap-2 p-2 bg-slate-100 mb-1 w-[49%] sm:w-[32%] lg:w-[25%] xl:w-[16%] rounded-md">
                        <div className="text-xs font-light bg-slate-900 rounded-lg p-0.5 text-white text-center">{team.teamNumber}</div>
                        <div className="text-xs font-bold">{team.nameShort}</div>
                    </div>
                ))}

            </div>
        </div>
    </div>
)}
</>)
}

