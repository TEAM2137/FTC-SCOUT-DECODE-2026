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

    interface qualMatch
        {
            description: string,
            tournamentLevel: string,
            series: number,
            matchNumber: number,
            startTime: string,
            actualStartTime: string,
            postResultTime: string,
            scoreRedFinal: number,
            scoreRedFoul: number,
            scoreRedAuto: number,
            scoreBlueFinal: number,
            scoreBlueFoul: number,
            scoreBlueAuto: number,
            redWins: boolean,
            blueWins: boolean,
            teams: [
                {
                    teamNumber: number,
                    displayTeamNumber: string,
                    station: string,
                    surrogate: boolean,
                    noShow: boolean,
                    dq: boolean,
                    onField: boolean,
                    teamName: string,
                },
            ]
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
    const [qualMatches, setQualMatches] = useState<[qualMatch]>([{description: 'loading', tournamentLevel: '', series: 0, matchNumber: 0, startTime: '', actualStartTime: '', postResultTime: '', scoreRedFinal: 0, scoreRedFoul: 0, scoreRedAuto: 0, scoreBlueFinal: 0, scoreBlueFoul: 0, scoreBlueAuto: 0, redWins: false, blueWins: false, teams: [{teamNumber: 0, displayTeamNumber: '', station: '', surrogate: false, noShow: false, dq: false, onField: false, teamName: ''},]}]);


    useEffect(() => {
        fetch(`/api/decode/events/${eventid}`)
        .then(res => res.json())
        .then(data => {
            setEvent(data);
        })
        .catch(err => console.log(err));
    }, [eventid]);

    useEffect(() => {
        fetch(`/api/ftc-events/events/${eventid}/quals`)
        .then(res => res.json())
        .then(data => {
            setQualMatches(data);
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

    {qualMatches.length < 1 ? (
        <p className="p-5 bg-red-200 rounded-md text-xl font-bold mb-2 italic">No Matches to display. The event schedule is ussually updated after the event starts and all robots have passed inspection.</p>
    ) : qualMatches[0].description === 'loading' ? (
            <p>Loading matches...</p>
    ) : (<>
        {qualMatches.map((match, index: number) => (
            <div key={index} className="grid grid-cols-4 grid-rows-4 p-0 bg-slate-100 border-2 border-slate-500 mb-2 mr-1 w-[100%] rounded-md justify-items-center place-items-center">
                <div className="row-start-1 col-start-1 col-span-4 p-1 text-sm font-semibold bg-slate-500 text-white w-full h-full ">{match.description}</div>
                <div className="row-start-2 col-start-1 col-span-1 p-1 text-xs font-bold w-full h-full text-right items-center">
                    {match.teams.map((team, tindex: number) => (
                        team.station === 'Red1' ? (
                            <div key={index+'-'+tindex}><span className="text-red-900 text-sm font-bold">{team.displayTeamNumber}</span></div>
                        ) 
                        : null
                    ))}
                </div>
                <div className="row-start-3 col-start-1 col-span-1 p-1 text-xs font-bold w-full h-full text-right items-center">
                    {match.teams.map((team, tindex: number) => (
                        team.station === 'Red2' ? (
                            <div key={index+'-'+tindex}><span className="text-red-900 text-sm font-bold">{team.displayTeamNumber}</span></div>
                        ) 
                        : null
                    ))}
                </div>
                <div className="row-start-2 row-span-2 col-start-2 col-span-1 text-2xl font-bold bg-red-300 text-center w-full h-full justify-items-center place-items-center">
                    <h1 className={match.redWins ? 'text-3xl' : 'text-2xl'}>{match.scoreRedFinal}</h1>
                    {match.redWins ? <h1 className="text-red-900 text-sm font-bold">WINNER</h1> : null}
                </div>
                <div className="row-start-2 row-span-2 col-start-3 col-span-1 text-2xl font-bold bg-blue-300 text-center w-full h-full  justify-items-center place-items-center">
                    <h1 className={match.blueWins ? 'text-3xl' : 'text-2xl'}>{match.scoreBlueFinal}</h1>
                    {match.blueWins ? <h1 className="text-blue-900 text-sm font-bold">WINNER</h1> : null}
                </div>
                <div className="row-start-2 col-start-4 col-span-1 p-1 text-xs font-bold w-full h-full text-left items-center">
                    {match.teams.map((team, tindex: number) => (
                        team.station === 'Blue1' ? (
                            <div key={index+'-'+tindex}><span className="text-blue-900 text-sm font-bold">{team.displayTeamNumber}</span></div>
                        ) 
                        : null
                    ))}
                </div>
                <div className="row-start-3 col-start-4 col-span-1 p-1 text-xs font-bold w-full h-full text-left items-center">
                    {match.teams.map((team, tindex: number) => (
                        team.station === 'Blue2' ? (
                            <div key={index+'-'+tindex}><h1 className="text-blue-900 text-sm font-bold">{team.displayTeamNumber}</h1></div>
                        ) 
                        : null
                    ))}
                </div>
                <div className="row-start-4 col-start-1 col-span-2 p-1 pr-2 text-xs font-normal bg-slate-500 text-white w-full h-full text-right">AUTO: {match.scoreRedAuto} FOUL: {match.scoreRedFoul}</div>
                <div className="row-start-4 col-start-3 col-span-2 p-1 pl-2 text-xs font-normal bg-slate-500 text-white w-full h-full text-left">AUTO: {match.scoreBlueAuto} FOUL: {match.scoreBlueFoul}</div>
            </div>
    ))}
    </>)}





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

