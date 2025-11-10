'use client'

import { useState, useEffect, use } from 'react';
import Loading from '../ui/Loading';
import Link from 'next/link';


interface IScheduleMatch
{
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    description: string,
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
    randomization: number,
    played: boolean,
    teams: [
       {
        teamNumber: number,
        station: string,
        surrogate: boolean,
        noShow: boolean,
        dq: boolean,
        onField: boolean,
        teamName: string,
        autoLeave: boolean,
        teleBase: string
      }
    ]
  }

function returnTime(date: string) {
    const dateObj = new Date(date);
    let hours = dateObj.getHours();
    const daypart = hours > 12 ? 'PM' : 'AM';
    if (hours > 12) { hours -= 12; }
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes + " " + daypart;
}


const Schedule = ({ eventCode }: { eventCode: string}) => {
    const [schedule, setSchedule] = useState<IScheduleMatch[]>([]);
    const [scheduleLoaded, setScheduleLoaded] = useState<boolean>(false);
    const [unplayedquals, setUnplayedquals] = useState<IScheduleMatch[]>([]);
    const [unplayedplayoffs, setUnplayedplayoffs] = useState<IScheduleMatch[]>([]);
    const [playedquals, setPlayedquals] = useState<IScheduleMatch[]>([]);
    const [playedplayoffs, setPlayedplayoffs] = useState<IScheduleMatch[]>([]);
    const [sortMatches, setSortMatches] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/scout/matches/' + eventCode, {cache: 'force-cache', next: { revalidate: 15 }})
        .then(res => res.json())
        .then(data => {
            data.sort((a: IScheduleMatch, b: IScheduleMatch) => a.matchNumber - b.matchNumber).sort((a: IScheduleMatch, b: IScheduleMatch) => b.matchLevel.localeCompare(a.matchLevel));
            setSchedule(data);
            setScheduleLoaded(true);
            setSortMatches(true);
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        function distributeMatches() {
            setSortMatches(false);
            if (schedule.length < 1) return;
            const unplayedquals: IScheduleMatch[] = [];
            const unplayedplayoffs: IScheduleMatch[] = [];
            const playedquals: IScheduleMatch[] = [];
            const playedplayoffs: IScheduleMatch[] = [];

            for (let i = 0; i < schedule.length; i++ ) {
                const match = schedule[i];
                if (match.played) {
                    if (match.matchLevel === 'QUALIFICATION') {
                        playedquals.push(match);
                    } else {
                        playedplayoffs.push(match);
                    }
                } else {
                    if (match.matchLevel === 'QUALIFICATION') {
                        unplayedquals.push(match);
                    } else {
                        unplayedplayoffs.push(match);
                    }
                }
            }
            unplayedquals.sort((a: IScheduleMatch, b: IScheduleMatch) => a.matchNumber - b.matchNumber)
            unplayedplayoffs.sort((a: IScheduleMatch, b: IScheduleMatch) => a.matchNumber - b.matchNumber)
            playedquals.sort((a: IScheduleMatch, b: IScheduleMatch) => b.matchNumber - a.matchNumber)
            playedplayoffs.sort((a: IScheduleMatch, b: IScheduleMatch) => b.matchNumber - a.matchNumber)
            setUnplayedquals(unplayedquals);
            setUnplayedplayoffs(unplayedplayoffs);
            setPlayedquals(playedquals);
            setPlayedplayoffs(playedplayoffs);
        }
        if (sortMatches) distributeMatches();
    }, [sortMatches, schedule, unplayedquals, unplayedplayoffs, playedquals, playedplayoffs]);

  return (
    <div>

    {!scheduleLoaded &&  <Loading /> }

    {unplayedquals.length > 0 && 
        <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
            <h1 className="p-2 font-bold">Upcoming Qualification Matches</h1> 
            <div className="flex flex-row flex-wrap w-full h-full bg-slate-50 text-gray-900 p-1 rounded-b-lg">
            
            
        {unplayedquals.map((match, i: number) => (
        <Link key={i} href={'/scout/event/'+eventCode+'/schedule/match/'+match.matchLevel+'/'+match.matchNumber+'/'+match.matchSeries}>
            <div key={i} className="grid grid-cols-[70px_60px_90px_60px_70px] grid-rows-[20px_30px_30px]  p-1 m-1 rounded-lg bg-slate-600 hover:bg-slate-400">
                <div className="col-start-1 row-start-1 col-span-5 font-bold text-left text-sm text-white pl-2">{match.description}</div>
                
                <div className="col-start-2 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                    {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-2 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                    {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-4 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                    {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-4 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                    {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-3 row-start-2 row-span-2 font-bold text-center text-sm  bg-slate-800">
                    <div className="flex flex-col w-full h-full justify-center place-items-center">
                    <div className="flex m-auto text-white text-xs justify-center place-self-center">UPCOMING</div>
                    <div className="flex m-auto text-white text-xsms justify-center place-self-center">{returnTime(match.startTime)}</div>
                    </div>
                </div>
                <div className="col-start-1 row-start-2 font-bold text-center text-sm  justify-center  bg-red-200"></div>
                <div className="col-start-1 row-start-3 font-bold text-center text-sm  justify-center rounded-bl-lg bg-red-200"></div>
                <div className="col-start-5 row-start-2 font-bold text-center text-sm  justify-center  bg-blue-200"></div>
                <div className="col-start-5 row-start-3 font-bold text-center text-sm  justify-center rounded-br-lg bg-blue-200"></div>


            </div>
        </Link>
        ))}
            </div>
        </div>
    }

    {unplayedplayoffs.length > 0 && 
        <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
            <h1 className="p-2 font-bold">Upcoming Playoff Matches</h1> 
            <div className="flex flex-row flex-wrap w-full h-full bg-slate-50 text-gray-900 p-1">
            
            
        {unplayedplayoffs.map((match, i: number) => (
        <Link key={i} href={'/scout/event/'+eventCode+'/schedule/match/'+match.matchLevel+'/'+match.matchNumber+'/'+match.matchSeries}>
            <div key={i} className="grid grid-cols-[70px_60px_90px_60px_70px] grid-rows-[20px_30px_30px]  p-1 m-1 rounded-lg bg-slate-600 hover:bg-slate-400">
                <div className="col-start-1 row-start-1 col-span-5 font-bold text-left text-sm text-white pl-2">{match.description}</div>
                
                <div className="col-start-2 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                    {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-2 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                    {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-4 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                    {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-4 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                    {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                        <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                    ))}
                </div>
                <div className="col-start-3 row-start-2 row-span-2 font-bold text-center text-sm  bg-slate-800">
                    <div className="flex flex-col w-full h-full justify-center place-items-center">
                    <div className="flex m-auto text-white text-xs justify-center place-self-center">UPCOMING</div>
                    <div className="flex m-auto text-white text-xsms justify-center place-self-center">{returnTime(match.startTime)}</div>
                    </div>
                </div>
                <div className="col-start-1 row-start-2 font-bold text-center text-sm  justify-center  bg-red-200"></div>
                <div className="col-start-1 row-start-3 font-bold text-center text-sm  justify-center rounded-bl-lg bg-red-200"></div>
                <div className="col-start-5 row-start-2 font-bold text-center text-sm  justify-center  bg-blue-200"></div>
                <div className="col-start-5 row-start-3 font-bold text-center text-sm  justify-center rounded-br-lg bg-blue-200"></div>


            </div>
        </Link>
        ))}
            </div>
        </div>
    }

    {playedplayoffs.length > 0 && 
        <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
            <h1 className="p-2 font-bold">Played Elimination Matches</h1> 
            <div className="flex flex-row flex-wrap w-full h-full bg-slate-50 text-gray-900 p-1">
            
            
            {playedplayoffs.map((match, i: number) => (
            <Link key={i} href={'/scout/event/'+eventCode+'/schedule/match/'+match.matchLevel+'/'+match.matchNumber+'/'+match.matchSeries}>
                <div key={i} className="grid grid-cols-[70px_60px_90px_60px_70px] grid-rows-[20px_30px_30px]  p-1 m-1 rounded-lg bg-slate-600 hover:bg-slate-400">
                    <div className="col-start-1 row-start-1 col-span-5 font-bold text-left text-sm text-white pl-2">{match.description}</div>
                    
                    <div className="col-start-2 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                        {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-2 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                        {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-4 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                        {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-4 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                        {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    
                    {match.redWins && !match.blueWins &&
                    <div className="col-start-3 row-start-2 row-span-2 font-bold text-sm justify-items-center place-content-center bg-red-800">
                        <div className="grid grid-cols-[45px_45px] justify-items-center place-items-center text-white m-auto">
                        <div className="text-2xl text-center">{match.scoreRedFinal}</div>
                        <div className="text-xl text-center">{match.scoreBlueFinal}</div>
                        </div>
                    </div>
                    }
                    {match.blueWins && !match.redWins &&
                    <div className="col-start-3 row-start-2 row-span-2 font-bold text-center text-sm justify-items-center place-content-center bg-blue-800">
                        <div className="grid grid-cols-[45px_45px] justify-items-center place-items-center text-white m-auto">
                        <div className="text-xl text-center">{match.scoreRedFinal}</div>
                        <div className="text-2xl text-center">{match.scoreBlueFinal}</div>
                        </div>
                    </div>
                    }



                    <div className="col-start-1 row-start-2 font-bold text-center text-sm  justify-center bg-red-900">
                        {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-start-1 row-start-3 font-bold text-center text-sm  justify-center rounded-bl-lg bg-red-900">
                        {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-start-5 row-start-2 font-bold text-center text-sm  justify-center  bg-blue-900">
                        {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>

                    <div className="col-start-5 row-start-3 font-bold text-center text-sm  justify-center rounded-br-lg bg-blue-900">
                        {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    


                </div>
            </Link>
            ))}
            </div>
        </div>
    }

    {playedquals.length > 0 && 
        <div className="flex flex-col mr-2 mb-2 w-[98%] bg-slate-700 rounded-lg">
            <h1 className="p-2 font-bold">Played Qualification Matches</h1> 
            <div className="flex flex-row flex-wrap w-full h-full bg-slate-50 text-gray-900 p-1">
            
            
            {playedquals.map((match, i: number) => (
            <Link key={i} href={'/scout/event/'+eventCode+'/schedule/match/'+match.matchLevel+'/'+match.matchNumber+'/'+match.matchSeries}>
                <div key={i} className="grid grid-cols-[70px_60px_90px_60px_70px] grid-rows-[20px_30px_30px]  p-1 m-1 rounded-lg bg-slate-600 hover:bg-slate-400">
                    <div className="col-start-1 row-start-1 col-span-5 font-bold text-left text-sm text-white pl-2">{match.description}</div>
                    
                    <div className="col-start-2 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                        {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-2 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-red-200">
                        {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-4 row-start-2 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                        {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    <div className="col-start-4 row-start-3 font-bold text-center text-lg  justify-center place-items-center  bg-blue-200">
                        {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                            <div key={i+'team'} className="m-auto">{team.teamNumber}</div>
                        ))}
                    </div>
                    
                    {match.redWins && !match.blueWins &&
                    <div className="col-start-3 row-start-2 row-span-2 font-bold text-sm justify-items-center place-content-center bg-red-800">
                        <div className="grid grid-cols-[45px_45px] justify-items-center place-items-center text-white m-auto">
                        <div className="text-2xl text-center">{match.scoreRedFinal}</div>
                        <div className="text-xl text-center">{match.scoreBlueFinal}</div>
                        </div>
                    </div>
                    }
                    {match.blueWins && !match.redWins &&
                    <div className="col-start-3 row-start-2 row-span-2 font-bold text-center text-sm justify-items-center place-content-center bg-blue-800">
                        <div className="grid grid-cols-[45px_45px] justify-items-center place-items-center text-white m-auto">
                        <div className="text-xl text-center">{match.scoreRedFinal}</div>
                        <div className="text-2xl text-center">{match.scoreBlueFinal}</div>
                        </div>
                    </div>
                    }
                    {!match.blueWins && !match.redWins &&
                    <div className="col-start-3 row-start-2 row-span-2 font-bold text-center text-sm justify-items-center place-content-center bg-violet-800">
                        <div className="grid grid-cols-[45px_45px] justify-items-center place-items-center text-white m-auto">
                        <div className="text-xl text-center">{match.scoreRedFinal}</div>
                        <div className="text-xl text-center">{match.scoreBlueFinal}</div>
                        </div>
                    </div>
                    }


                    <div className="col-start-1 row-start-2 font-bold text-center text-sm  justify-center bg-red-900">
                        {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-start-1 row-start-3 font-bold text-center text-sm  justify-center rounded-bl-lg bg-red-900">
                        {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-start-5 row-start-2 font-bold text-center text-sm  justify-center  bg-blue-900">
                        {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>

                    <div className="col-start-5 row-start-3 font-bold text-center text-sm  justify-center rounded-br-lg bg-blue-900">
                        {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                            <div key={i+'team'} className="flex flex-row w-full h-full m-auto justify-center place-items-center">
                                <button className={team.autoLeave ? 
                                    'px-1.5 text-xs text-white bg-green-600 rounded-full' : 
                                    'px-1.5 text-xs text-white bg-red-600 rounded-full' } >&nbsp;</button>

                                <button className="px-1 text-sm text-white rounded-full" >--</button>
                                
                                {team.teleBase === 'NONE' &&
                                <button className='px-1.5 text-xs text-white bg-red-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'PARTIAL' &&
                                <button className='px-1.5 text-xs text-white bg-amber-600 rounded-full'>&nbsp;</button>
                                }
                                {team.teleBase === 'FULL' &&
                                <button className='px-1.5 text-xs text-white bg-green-600 rounded-full'>&nbsp;</button>
                                }
                            </div>
                        ))}
                    </div>
                    


                </div>
            </Link>
            ))}
            </div>
        </div>
    }



    </div>
  )
}

export default Schedule