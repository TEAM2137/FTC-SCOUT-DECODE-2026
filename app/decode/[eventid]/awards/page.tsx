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

    interface eventAwards
        {
            awardID: number,
            eventCode: string,
            displayTeamNumber: string,
            name: string,
            series: number,
            teamNumber: number,
            schoolName: string,
            fullTeamName: string,
            person: string,
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
    const [awards, setAwards] = useState<[eventAwards]>([{awardID: 0, eventCode: '', displayTeamNumber: '', name: '', series: 0, teamNumber: 0, schoolName: '', fullTeamName: '', person: '',},]);


    useEffect(() => {
        fetch(`/api/decode/events/${eventid}`)
        .then(res => res.json())
        .then(data => {
            setEvent(data);
        })
        .catch(err => console.log(err));
    }, [eventid]);

    useEffect(() => {
        fetch(`/api/ftc-events/events/${eventid}/awards`)
        .then(res => res.json())
        .then(data => {
            setAwards(data);
        })
        .catch(err => console.log(err));
    }, [eventid]);


  return (<>

{event.code === 'loading' ? (
            <p>Loading Event Data...</p>
) : (
    <div className='text-black p-2 w-[100%]'>
        <h1 className="text-2xl font-black">{event.name}</h1>
        <p className="text-sm font-normal">{event.typeName} | {event.city}, {event.stateprov}, {event.country} | {returnDate(event.dateStart)} to {returnDate(event.dateEnd)}</p>

        <h1 className="p-2 font-bold text-xl text-black">Awards</h1>


    {awards.length < 1 ? (
        <p className="p-5 bg-red-200 rounded-md text-xl font-bold mb-2 italic">No Awards to display. Awards for the event will update after the event has completed.</p>
    ) : awards[0].awardID === 0 ? (
            <p>Loading awards...</p>
    ) : (
        <div className="flex flex-col p-0 bg-slate-100 border-2 border-slate-500 mb-2 mr-1 w-[100%] rounded-md justify-items-center place-items-center">

            

        {awards.filter((award) => award.teamNumber > 0).map((award, index: number) => (<div key={index} className="w-full p-0">
            <div className="grid grid-cols-12 w-full p-0">
                <div className="col-start-1 col-span-6 py-2 pr-1 text-xs font-bold bg-slate-500 text-white w-full h-full text-right">{award.name}</div>
                <div className="col-start-7 col-span-2 p-2 text-sm font-bold text-black w-full h-full text-center border-b-2 border-b-slate-500">{award.teamNumber}</div>
                <div className="col-start-9 col-span-4 p-2 text-sm font-normal text-black w-full h-full text-left  border-b-2 border-b-slate-500"> 
                    {event.teamsList.map((team, index: number) => (<>
                        {team.teamNumber === award.teamNumber ? (
                            <div key={index} className="text-sm font-bold text-black">{team.nameShort}</div>
                        ) : ( null )}
                    </>))}
                </div>
            </div>
        </div>))}
    </div>)}





        <div className="bg-slate-600 w-[100%] rounded-md border-2 border-slate-600">
            <h1 className="p-2 font-bold text-xl text-white">{event.teamsList.length} Teams Participating <span className="text-sm">(from FTC-EVENTS API)</span></h1>
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

