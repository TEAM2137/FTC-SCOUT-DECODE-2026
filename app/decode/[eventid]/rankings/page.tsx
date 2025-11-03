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

    interface eventRankings
        {
            rank: number,
            teamNumber: number,
            displayTeamNumber: string,
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
    const [rankings, setRankings] = useState<[eventRankings]>([{rank: 0, teamNumber: 0, displayTeamNumber: '', teamName: '', sortOrder1: 0, sortOrder2: 0, sortOrder3: 0, sortOrder4: 0, sortOrder5: 0, sortOrder6: 0, wins: 0, losses: 0, ties: 0, qualAverage: 0, dq: 0, matchesPlayed: 0, matchesCounted: 0,}]);


    useEffect(() => {
        fetch(`/api/decode/events/${eventid}`)
        .then(res => res.json())
        .then(data => {
            setEvent(data);
        })
        .catch(err => console.log(err));
    }, [eventid]);

    useEffect(() => {
        fetch(`/api/ftc-events/events/${eventid}/rankings`)
        .then(res => res.json())
        .then(data => {
            setRankings(data);
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

        <h1 className="p-2 font-bold text-xl text-black">Matches <span className="text-sm">(from FTC-EVENTS API)</span></h1>
        <p className="p-2 font-light text-sm text-black italic mb-2">During the event the yet to be played matched will be displayed first with the results from the played matches listed below.</p>

    {rankings.length < 1 ? (
        <p className="p-5 bg-red-200 rounded-md text-xl font-bold mb-2 italic">No Rankings to display. Rankings for the event will update as the qualification matches are played.</p>
    ) : rankings[0].rank === 0 ? (
            <p>Loading rankings...</p>
    ) : (
        <div className="flex flex-col p-0 bg-slate-100 border-2 border-slate-500 mb-2 mr-1 w-[100%] rounded-md justify-items-center place-items-center">

            <div className="grid sm:hidden grid-cols-12 w-full p-0">
                <div className="col-start-1 col-span-1 p-0 text-xs font-normal bg-slate-500 text-white w-full h-full text-center">Rank</div>
                <div className="col-start-2 col-span-2 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Number</div>
                <div className="col-start-4 col-span-6 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Name</div>
                <div className="col-start-10 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">ARP</div>
                <div className="col-start-11 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">AMS</div>
                <div className="col-start-12 col-span-1 p-0 text-xs font-normal  text-black w-full h-full text-center">ABP</div>
            </div>

            <div className="hidden sm:grid grid-cols-17 w-full p-0">
                <div className="col-start-1 col-span-1 p-0 text-xs font-normal bg-slate-500 text-white w-full h-full text-center">Rank</div>
                <div className="col-start-2 col-span-2 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Number</div>
                <div className="col-start-4 col-span-6 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Name</div>
                <div className="col-start-10 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">ARP</div>
                <div className="col-start-11 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">AMS</div>
                <div className="col-start-12 col-span-1 p-0 text-xs font-normal  text-black w-full h-full text-center">ABP</div>
                <div className=" col-start-13 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">AAS</div>
                <div className=" col-start-14 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Ws</div>
                <div className=" col-start-15 col-span-1 p-0 text-xs font-normal bg-slate-100 text-black w-full h-full text-center">Ls</div>
                <div className=" col-start-16 col-span-1 p-0 text-xs font-normal text-black w-full h-full text-center">Ts</div>
                <div className=" col-start-17 col-span-1 p-0 text-xs font-normal text-black w-full h-full text-center">P</div>
            </div>

        {rankings.map((rank, index: number) => (<div key={index} className="w-full p-0">
            <div className="grid sm:hidden grid-cols-12 w-full p-0">
                <div className="col-start-1 col-span-1 p-0 text-2xl font-black bg-slate-500 text-white w-full h-full text-center">{rank.rank}</div>
                <div className="col-start-2 col-span-2 p-2 text-sm font-bold text-black w-full h-full text-center">{rank.teamNumber}</div>
                <div className="col-start-4 col-span-6 p-3 text-xs font-semibold text-black w-full h-full text-left">{rank.teamName}</div>
                <div className="col-start-10 col-span-1 p-2 text-sm font-bold text-black w-full h-full text-center">{rank.sortOrder1}</div>
                <div className="col-start-11 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.sortOrder2}</div>
                <div className="col-start-12 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.sortOrder3}</div>
            </div>

            <div className="hidden sm:grid grid-cols-17 w-full p-0">
                <div className="col-start-1 col-span-1 p-0 text-2xl font-black bg-slate-500 text-white w-full h-full text-center">{rank.rank}</div>
                <div className="col-start-2 col-span-2 p-2 text-sm font-bold text-black w-full h-full text-center">{rank.teamNumber}</div>
                <div className="col-start-4 col-span-6 p-3 text-xs font-semibold text-black w-full h-full text-left">{rank.teamName}</div>
                <div className="col-start-10 col-span-1 p-2 text-sm font-bold text-black w-full h-full text-center">{rank.sortOrder1}</div>
                <div className="col-start-11 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.sortOrder2}</div>
                <div className="col-start-12 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.sortOrder3}</div>
                
                <div className=" col-start-13 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.sortOrder4}</div>
                <div className=" col-start-14 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.wins}</div>
                <div className=" col-start-15 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.losses}</div>
                <div className=" col-start-16 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.ties}</div>
                <div className=" col-start-17 col-span-1 p-2 text-xs font-bold text-black w-full h-full text-center">{rank.matchesPlayed}</div>
            </div>
        </div>))}
    </div>)}

            <div className="grid grid-cols-6 grid-rows-9  w-[100%] rounded-md border-2 border-slate-500">
                <div className="col-start-1 col-span-6 p-2 text-lg bg-slate-500 font-semibold text-white w-full h-full text-left">Legend</div>
                <div className="row-start-2 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">ARP</div>
                <div className="row-start-2 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Average Ranking Points</div>
                <div className="row-start-3 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">AMS</div>
                <div className="row-start-3 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Average Match Score</div>
                <div className="row-start-4 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">ABP</div>
                <div className="row-start-4 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Average Base Points</div>
                <div className="row-start-5 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">AAS</div>
                <div className="row-start-5 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Average Autonomous Points</div>
                <div className="row-start-6 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">Ws</div>
                <div className="row-start-6 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Matches Won</div>
                <div className="row-start-7 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">Ls</div>
                <div className="row-start-7 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Matches Lost</div>
                <div className="row-start-8 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">Ts</div>
                <div className="row-start-8 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Matches Tied</div>
                <div className="row-start-9 col-start-1 col-span-1 p-1 text-sm font-bold text-black w-full h-full text-center">Ps</div>
                <div className="row-start-9 col-start-2 col-span-5 p-1 text-sm font-normal text-black w-full h-full text-left">Matches Played</div>
            </div>



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

