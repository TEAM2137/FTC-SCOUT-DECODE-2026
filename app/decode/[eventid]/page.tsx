'use client'
import Link from 'next/link'
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
    }, [eventid]);



  return (<>
{event.code === 'loading' ? (
            <p>Loading teams...</p>
) : (
    <div className='text-black p-2 w-[100%]'>
        <h1 className="text-2xl font-black">{event.name}</h1>
        <p className="text-sm font-normal">{event.typeName} | {event.city}, {event.stateprov}, {event.country} | {returnDate(event.dateStart)} to {returnDate(event.dateEnd)}</p>

        <div className="bg-slate-600 w-[100%] rounded-md border-2 border-slate-600 mb-2">
            <h1 className="p-2 font-bold text-xl text-white">Event Results <span className="text-sm">(from FTC-EVENTS API)</span></h1>
            <div className="bg-white p-1 flex flex-row flex-wrap rounded-b-md">
                
                    <div  className="flex flex-row mb-1 mr-1 w-[99%] sm:w-[49%] place-items-center">
                        <Link href={`/decode/${event.code}/rankings`} className="w-[100%]">
                        <button className="w-[100%] bg-blue-800 hover:bg-blue-700 active:bg-blue-900 py-2 rounded-md text-white font-semibold">Rankings</button>
                        </Link>

                    </div>
                    <div  className="flex flex-row mb-1 mr-1 w-[99%] sm:w-[49%] place-items-center">
                        <Link href={`/decode/${event.code}/quals`} className="w-[100%]">
                        <button className="w-[100%] bg-blue-800 hover:bg-blue-700 active:bg-blue-900 py-2 rounded-md text-white font-semibold">Qualification Matches</button>
                        </Link>
                    </div>
                    <div  className="flex flex-row gap-2 bg-slate-100 mb-1 mr-1 w-[99%] sm:w-[49%] lg:w-[32%] rounded-md justify-items-center place-items-center">
                        <Link href={`/decode/${event.code}/playoffs`} className="w-[100%]">
                        <button className="w-[100%] bg-blue-800 hover:bg-blue-700 active:bg-blue-900 py-2 rounded-md text-white font-semibold">Playoff Matches</button>
                        </Link>
                    </div>
                    <div  className="flex flex-row mb-1 mr-1 w-[99%] sm:w-[49%] place-items-center">
                        <Link href={`/decode/${event.code}/awards`} className="w-[100%]">
                        <button className="w-[100%] bg-blue-800 hover:bg-blue-700 active:bg-blue-900 py-2 rounded-md text-white font-semibold">Awards</button>
                        </Link>
                    </div>

            </div>
        </div>

        <div className="bg-slate-600 w-[100%] rounded-md border-2 border-slate-600 mb-2">
            <h1 className="p-2 font-bold text-xl text-white">SCOUTING TOOLS <span className="text-sm">(Log-in Required)</span></h1>
            <div className="bg-white p-1 flex flex-row flex-wrap rounded-b-md">
                
                    <div  className="flex flex-row gap-2 p-2 bg-slate-100 mb-1 mr-1 w-[99%] sm:w-[49%] lg:w-[32%] rounded-md justify-items-center place-items-center">
                        <button className="">Scout Matches</button>
                    </div>
                    <div  className="flex flex-row gap-2 p-2 bg-slate-100 mb-1 mr-1 w-[99%] sm:w-[49%] lg:w-[32%] rounded-md justify-items-center place-items-center">
                        <button className="">Insights</button>
                    </div>
                    <div  className="flex flex-row gap-2 p-2 bg-slate-100 mb-1 mr-1 w-[99%] sm:w-[49%] lg:w-[32%] rounded-md justify-items-center place-items-center">
                        <button className="">Alliance Selector</button>
                    </div>

            </div>
        </div>

        <div className="bg-slate-600 w-[100%] rounded-md border-2 border-slate-600">
            <h1 className="p-2 font-bold text-xl text-white">{event.teamsList.length} Teams Participating</h1>
            <div className="bg-white p-1 flex flex-row flex-wrap rounded-b-md">
                {event.teamsList.map((team, index: number) => (
                    <div key={index} className="flex flex-row gap-2 p-2 bg-slate-100 mb-1 mr-1 w-[99%] sm:w-[49%] lg:w-[32%] rounded-md justify-items-center place-items-center">
                        <div className="text-sm font-extrabold p-0.5 text-center">{team.teamNumber}</div>
                        <div className="text-xs font-bold">{team.nameShort}</div>
                        <div className="text-xs font-light">from {team.city}, {team.stateProv}</div>
                    </div>
                ))}
            </div>
        </div>


    </div>
)}
</>)
}

