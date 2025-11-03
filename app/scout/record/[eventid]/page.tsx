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

  return (<div className='min-w-full min-h-screen p-2'>
    <div className="text-lg font-bold border-b-1 border-slate-600 w-full">Scouting {event.name} </div>
    
    <div className="flex flex-wrap gap-2 mt-2">
    {qualMatches.length < 1 ? (
        <p className="p-5 bg-red-200 rounded-md text-xl font-bold mb-2 italic">No Matches to display. The event schedule is ussually updated after the event starts and all robots have passed inspection.</p>
    ) : qualMatches[0].description === 'loading' ? (
            <p>Loading matches...</p>
    ) : (<>
        {qualMatches.map((match, index: number) => (
            <div key={index} className="flex flex-col p-0  w-[100%] sm:w-[49%] lg:w-[32%] xl:w-[24%] justify-items-center place-items-center">
                <div className="row-start-1 col-start-1 col-span-4 px-1 text-md font-semibold w-full ">{match.description}</div>
                <div className="grid grid-cols-4 gap-2 w-full">
                    <div className="col-start-1 text-xs font-bold w-full items-center">
                        {match.teams.map((team, tindex: number) => (
                            team.station === 'Red1' ? (
                                <div key={index+'-'+tindex}>
                                    <Link href={`/scout/record/${eventid}/${'Qualification'}/${match.matchNumber}/${team.teamNumber}/${'Red1'}`}>
                                    <button className="bg-red-900 text-sm font-bold w-full rounded-md">{team.displayTeamNumber}
                                        <br/><span className="text-lg">---</span>
                                    </button>
                                    </Link>
                                </div>
                            ) 
                            : null
                        ))}
                    </div>
                    <div className="col-start-2 text-xs font-bold w-full items-center">
                        {match.teams.map((team, tindex: number) => (
                            team.station === 'Red2' ? (
                                <div key={index+'-'+tindex}>
                                    <Link href={`/scout/record/${eventid}/${'Qualification'}/${match.matchNumber}/${team.teamNumber}/${'Red2'}`}>
                                    <button className="bg-red-900 text-sm font-bold w-full rounded-md">{team.displayTeamNumber}
                                        <br/><span className="text-lg">---</span>
                                    </button>
                                    </Link>
                                </div>
                            ) 
                            : null
                        ))}
                    </div>
                    <div className="col-start-3 text-xs font-bold w-full items-center">
                        {match.teams.map((team, tindex: number) => (
                            team.station === 'Blue1' ? (
                                <div key={index+'-'+tindex}>
                                    <Link href={`/scout/record/${eventid}/${'Qualification'}/${match.matchNumber}/${team.teamNumber}/${'Blue1'}`}>
                                    <button className="bg-blue-900 text-sm font-bold w-full rounded-md">{team.displayTeamNumber}
                                        <br/><span className="text-lg">---</span></button>
                                    </Link>
                                </div>
                            ) 
                            : null
                        ))}
                    </div>
                    <div className="col-start-4 text-xs font-bold w-full items-center">
                        {match.teams.map((team, tindex: number) => (
                            team.station === 'Blue2' ? (
                                <div key={index+'-'+tindex}>
                                    <Link href={`/scout/record/${eventid}/${'Qualification'}/${match.matchNumber}/${team.teamNumber}/${'Blue2'}`}>
                                    <button className="bg-blue-900 text-sm font-bold w-full rounded-md">{team.displayTeamNumber}
                                        <br/><span className="text-lg">---</span>
                                    </button>
                                    </Link>
                                </div>
                            ) 
                            : null
                        ))}
                    </div>
                </div>
                <div className=" p-1 text-xs font-normal w-full  text-right">Staus: Not Scouted</div>
                
            </div>
    ))}
    </>)}
    </div>
    
  </div>)
}
