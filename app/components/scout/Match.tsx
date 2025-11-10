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

interface IMatchScore {
      scoutID: string,
      scoutTeam: string,
      scoutName: string,
      eventCode: string,
      matchLevel: string,
      matchNumber: number,
      matchSeries: number,
      teamNumber: number,
      autoArtifacts: number,
      teleArtifacts: number,
      autoLeave: number,
      teleBaseFull: number,
      teleBasePartial: number,
      doubleBaseRaise: number,
      doubleBaseLift: number,
      score: number,
      ignore: boolean,
      hide: boolean,
}

function returnDate(date: string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dateObj = new Date(date);
    const month = months[dateObj.getMonth()];
    const day = days[dateObj.getDay()];
    const dayNumber = dateObj.getDate();
    const year = dateObj.getFullYear();
    return day + " (" +month + " " + dayNumber + ", " + year + ")";

}

function returnTime(date: string) {
    const dateObj = new Date(date);
    let hours = dateObj.getHours();
    const daypart = hours > 12 ? 'PM' : 'AM';
    if (hours > 12) { hours -= 12; }
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes + " " + daypart;
}


const Match = ({ eventCode, level, number, series }: { eventCode: string, level: string, number: number, series: number}) => {
    const [match, setMatch] = useState<IScheduleMatch>();
    const [matchData, setMatchData] = useState<IMatchScore[]>([]);  
    const [matchLoaded, setMatchLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/scout/matches/' + eventCode + '/' + level + '/' + number + '/' + series, {cache: 'force-cache', next: { revalidate: 15 }})
        .then(res => res.json())
        .then(data => {
            setMatch(data);
            setMatchLoaded(true);
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetch('/api/scout/matches/' + eventCode + '/' + level + '/' + number + '/' + series + '/matchdata', {cache: 'no-cache'})
        .then(res => res.json())
        .then(data => {
            setMatchData(data);
        })
        .catch(err => console.log(err));
    }, []);


    return (
        <div>
            {!matchLoaded &&  <Loading /> }

            {match &&
            <h1 className="text-xl sm:text-3xl font-bold mb-2">{match.description}</h1>
            }

            {match && match.played &&
                <p className="text-xs italic">Played on {returnDate(match.actualStartTime)} at {returnTime(match.actualStartTime)}</p>
            }
            {match && !match.played &&
                <p className="text-xs italic">Playing on {returnDate(match.startTime)} at {returnTime(match.startTime)}</p>
            }

            {match &&
            <div>
                <div className="flex flex-col w-full h-full bg-red-950 text-white p-1 my-4 rounded-lg">
                    <div className="grid grid-cols-[150px_1fr] grid-rows-[20px] m-1 rounded-lg">
                        <div className="justify-items-center place-content-center text-left text-sm font-bold" >Red Alliance</div>
                        <div className="justify-items-center place-content-center text-right text-xs font-bold" >
                            {match.scoreRedFinal && 'SCORE: ' + match.scoreRedFinal} | {match.scoreRedFinal && 'AUTO: ' + match.scoreRedAuto} | {match.scoreRedFinal && 'FOULS: ' + match.scoreRedFoul} {match.redWins ? ' | Winner' : ''}
                        </div>
                    </div>
                    {match.teams.filter((team) => team.station === 'Red1').map((team, i: number) => (
                    <div key={i+'team'} className="grid grid-rows-[30px_1fr]  m-1 rounded-lg bg-blue-300 hover:bg-blue-200">
                        <div  className="px-2 text-left text-xl font-bold text-gray-800 rounded-l-lg" >
                            {team.teamNumber} - {team.teamName}
                        </div>
                        <div  className="p-2 justify-items-center place-content-center text-center text-xl font-bold text-gray-800 rounded-l-lg" >
                            {matchData.filter((matchScore) => matchScore.teamNumber === team.teamNumber).map((matchScore, i: number) => (
                            <div key={i} className="grid grid-cols-4 sm:grid-cols-7 grid-rows-1 w-full mb-1  text-xs text-gray-800 border-b-2 border-gray-500 " >
                                
                                <div>Afs {matchScore.autoArtifacts + matchScore.teleArtifacts} ({matchScore.autoArtifacts}|{matchScore.teleArtifacts}) </div>
                                <div>Leave: {matchScore.autoLeave === 1 ? 'Yes' : 'No'}</div>
                                <div>Base: {matchScore.teleBaseFull === 1 && 'Full'}{matchScore.teleBasePartial === 1 && 'Partial'}{matchScore.teleBaseFull === 0 && matchScore.teleBasePartial === 0 && 'None'}</div>
                                <div>{matchScore.scoutTeam}-{matchScore.scoutName}</div>
                                <div></div>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">EDIT</button>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">IGNORE</button>
                            </div>
                            ))}
                            <Link href={'/scout/record/'+eventCode+'/'+level+'/'+number+'/'+series+'/'+team.teamNumber}>
                            <button className="w-full bg-slate-600 text-white font-bold p-1 mt-1 rounded-lg">Click To Scout</button>
                            </Link>
                        </div>
                    </div>
                    ))}
                    {match.teams.filter((team) => team.station === 'Red2').map((team, i: number) => (
                    <div key={i+'team'} className="grid grid-rows-[30px_1fr]  m-1 rounded-lg bg-blue-300 hover:bg-blue-200">
                        <div  className="px-2 text-left text-xl font-bold text-gray-800 rounded-l-lg" >
                            {team.teamNumber} - {team.teamName}
                        </div>
                        <div  className="p-2 justify-items-center place-content-center text-center text-xl font-bold text-gray-800 rounded-l-lg" >
                            {matchData.filter((matchScore) => matchScore.teamNumber === team.teamNumber).map((matchScore, i: number) => (
                            <div key={i} className="grid grid-cols-4 sm:grid-cols-7 grid-rows-1 w-full mb-1  text-xs text-gray-800 border-b-2 border-gray-500 " >
                                
                                <div>Afs {matchScore.autoArtifacts + matchScore.teleArtifacts} ({matchScore.autoArtifacts}|{matchScore.teleArtifacts}) </div>
                                <div>Leave: {matchScore.autoLeave === 1 ? 'Yes' : 'No'}</div>
                                <div>Base: {matchScore.teleBaseFull === 1 && 'Full'}{matchScore.teleBasePartial === 1 && 'Partial'}{matchScore.teleBaseFull === 0 && matchScore.teleBasePartial === 0 && 'None'}</div>
                                <div>{matchScore.scoutTeam}-{matchScore.scoutName}</div>
                                <div></div>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">EDIT</button>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">IGNORE</button>
                            </div>
                            ))}
                            <Link href={'/scout/record/'+eventCode+'/'+level+'/'+number+'/'+series+'/'+team.teamNumber}>
                            <button className="w-full bg-slate-600 text-white font-bold p-1 mt-1 rounded-lg">Click To Scout</button>
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="flex flex-col w-full h-full bg-blue-950 text-white p-1 my-4 rounded-lg">
                    <div  className="grid grid-cols-[150px_1fr] grid-rows-[20px] m-1 rounded-lg">
                        <div className="justify-items-center place-content-center text-left text-sm font-bold" >Blue Alliance</div>
                        <div className="justify-items-center place-content-center text-right text-xs font-bold" >
                            {match.scoreRedFinal && 'SCORE: ' + match.scoreRedFinal} | {match.scoreBlueFinal && 'AUTO: ' + match.scoreBlueAuto} | {match.scoreBlueFinal && 'FOULS: ' + match.scoreRedFoul} {match.blueWins ? ' | Winner' : ''}
                        </div>
                    </div>
                    {match.teams.filter((team) => team.station === 'Blue1').map((team, i: number) => (
                    <div key={i+'team'} className="grid grid-rows-[30px_1fr]  m-1 rounded-lg bg-blue-300 hover:bg-blue-200">
                        <div  className="px-2 text-left text-xl font-bold text-gray-800 rounded-l-lg" >
                            {team.teamNumber} - {team.teamName}
                        </div>
                        <div  className="p-2 justify-items-center place-content-center text-center text-xl font-bold text-gray-800 rounded-l-lg" >
                            {matchData.filter((matchScore) => matchScore.teamNumber === team.teamNumber).map((matchScore, i: number) => (
                            <div key={i} className="grid grid-cols-4 sm:grid-cols-7 grid-rows-1 w-full mb-1  text-xs text-gray-800 border-b-2 border-gray-500 " >
                                
                                <div>Afs {matchScore.autoArtifacts + matchScore.teleArtifacts} ({matchScore.autoArtifacts}|{matchScore.teleArtifacts}) </div>
                                <div>Leave: {matchScore.autoLeave === 1 ? 'Yes' : 'No'}</div>
                                <div>Base: {matchScore.teleBaseFull === 1 && 'Full'}{matchScore.teleBasePartial === 1 && 'Partial'}{matchScore.teleBaseFull === 0 && matchScore.teleBasePartial === 0 && 'None'}</div>
                                <div>{matchScore.scoutTeam}-{matchScore.scoutName}</div>
                                <div></div>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">EDIT</button>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">IGNORE</button>
                            </div>
                            ))}
                            <Link href={'/scout/record/'+eventCode+'/'+level+'/'+number+'/'+series+'/'+team.teamNumber}>
                            <button className="w-full bg-slate-600 text-white font-bold p-1 mt-1 rounded-lg">Click To Scout</button>
                            </Link>
                        </div>
                    </div>
                    ))}
                    {match.teams.filter((team) => team.station === 'Blue2').map((team, i: number) => (
                    <div key={i+'team'} className="grid grid-rows-[30px_1fr]  m-1 rounded-lg bg-blue-300 hover:bg-blue-200">
                        <div  className="px-2 text-left text-xl font-bold text-gray-800 rounded-l-lg" >
                            {team.teamNumber} - {team.teamName}
                        </div>
                        <div  className="p-2 justify-items-center place-content-center text-center text-xl font-bold text-gray-800 rounded-l-lg" >
                            {matchData.filter((matchScore) => matchScore.teamNumber === team.teamNumber).map((matchScore, i: number) => (
                            <div key={i} className="grid grid-cols-4 sm:grid-cols-7 grid-rows-1 w-full mb-1  text-xs text-gray-800 border-b-2 border-gray-500 " >
                                
                                <div>Afs {matchScore.autoArtifacts + matchScore.teleArtifacts} ({matchScore.autoArtifacts}|{matchScore.teleArtifacts}) </div>
                                <div>Leave: {matchScore.autoLeave === 1 ? 'Yes' : 'No'}</div>
                                <div>Base: {matchScore.teleBaseFull === 1 && 'Full'}{matchScore.teleBasePartial === 1 && 'Partial'}{matchScore.teleBaseFull === 0 && matchScore.teleBasePartial === 0 && 'None'}</div>
                                <div>{matchScore.scoutTeam}-{matchScore.scoutName}</div>
                                <div></div>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">EDIT</button>
                                <button className="hidden sm:block mx-1 text-xs text-white font-bold px-2 rounded-lg bg-blue-900">IGNORE</button>
                            </div>
                            ))}
                            <Link href={'/scout/record/'+eventCode+'/'+level+'/'+number+'/'+series+'/'+team.teamNumber}>
                            <button className="w-full bg-slate-600 text-white font-bold p-1 mt-1 rounded-lg">Click To Scout</button>
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>

            </div>
            }
        </div>
    )
}

export default Match