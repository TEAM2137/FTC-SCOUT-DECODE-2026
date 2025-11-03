'use client'

import Link from 'next/link'
import { saveMatchScore } from '@/lib/decode/saveMatchScore';
import { use, useEffect, useState } from 'react'

interface matchScore
    {
      scoutID: string,
      scoutTeam: string,
      scoutName: string,
      eventid: string,
      tournamentLevel: string,
      matchNumber: number,
      teamNumber: number,
      station: string,
      autoArtifacts: number,
      teleArtifacts: number,
      autoLeave: number,
      teleBaseFull: number,
      teleBasePartial: number,
      doubleBaseRaise: number,
      doubleBaseLift: number,
      score: number,
      use: boolean,
    }

//These will be set by Auth in the future
const scoutTeam = "2137"
const scoutName = "tester"




export default function Page({ params, }: 
  { params: Promise<{ eventid: string, level: string, match: number, team: number, pos: string }>}){
  const { eventid, level, match, team, pos } = use(params)
  const scoutID = scoutName + "_" + scoutTeam + "_" + eventid + "_" + level + "_" + match + "_" + team
  const [save, setSave] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string>('');
  const [saveRslt, setSaveRslt] = useState<boolean>(false);
  const [saveRsltMsg, setSaveRsltMsg] = useState<string>('');

  const [matchScore, setMatchScore] = useState<matchScore>({scoutID: scoutID, scoutTeam: scoutTeam, scoutName: scoutName, eventid: eventid, tournamentLevel: level, matchNumber: match, teamNumber: team, station: pos, autoArtifacts: 0, teleArtifacts: 0, autoLeave: 0, teleBaseFull: 0, teleBasePartial: 0, doubleBaseRaise: 0, doubleBaseLift: 0, score: 0, use: true});
  const [autoArtifacts, setAutoArtifacts] = useState<number>(0);
  const [teleArtifacts, setTeleArtifacts] = useState<number>(0);
  const [autoLeave, setAutoLeave] = useState<boolean>(false);
  const [teleBase, setTeleBase] = useState<string>('NONE');
  const [doubleBase, setDoubleBase] = useState<string>('NONE');

  useEffect(() => {
    if (autoArtifacts < 0) {
      setAutoArtifacts(0);
    }
    if (teleArtifacts < 0) {
      setTeleArtifacts(0);
    }
  }, [autoArtifacts, teleArtifacts]);

  useEffect(() => {
    const newMatchScore = matchScore
    newMatchScore.autoArtifacts = autoArtifacts;
    newMatchScore.teleArtifacts = teleArtifacts;
    if (autoLeave) { newMatchScore.autoLeave = 1} else {newMatchScore.autoLeave = 0};
    if (teleBase === 'FULL') { newMatchScore.teleBaseFull = 1; newMatchScore.teleBasePartial = 0} 
    else if (teleBase === 'PARTIAL') { newMatchScore.teleBaseFull = 0; newMatchScore.teleBasePartial = 1} 
    else {newMatchScore.teleBaseFull = 0; newMatchScore.teleBasePartial = 0};
    if (doubleBase === 'RAISE') { newMatchScore.doubleBaseRaise = 1; newMatchScore.doubleBaseLift = 0} 
    else if (doubleBase === 'LIFT') { newMatchScore.doubleBaseRaise = 0; newMatchScore.doubleBaseLift = 1} 
    else {newMatchScore.doubleBaseRaise = 0; newMatchScore.doubleBaseLift = 0};
    const calculatedScore = (autoArtifacts * 3) + (teleArtifacts * 3) + (newMatchScore.autoLeave * 3) + (newMatchScore.teleBaseFull * 10) + (newMatchScore.teleBasePartial * 5);
    newMatchScore.score = calculatedScore;
    setMatchScore(newMatchScore)
  }, [autoArtifacts, teleArtifacts, autoLeave, teleBase, doubleBase, matchScore]);

useEffect(() => {
    async function saveMS() {
      if (save) {
          console.log(matchScore)
          setSaveMsg('Saving Match Score to the Database...')
          try {
            const saved = await saveMatchScore(matchScore);
            if (saved) {
              setSaveRslt(true);
              setSaveRsltMsg('Match Score Saved!');
            } else {
              setSaveRslt(true);
              setSaveRsltMsg('Match Score NOT Saved!');
            }
          } catch (error) {
            setSaveRslt(true);
            setSaveRsltMsg('Error Saving Match Score');
            console.log(error);
          }
      }
    }
    saveMS();
  }, [save, matchScore]);



  return (
    <div className="flex flex-col gap-1 min-h-screen bg-slate-900 w-full h-full place-items-center justify-items-center">
        <h1 className="p-1 m-auto text-center w-[350px] text-xl font-black">Scouting {level} Match {match}</h1>
        <p className="p-1 m-auto text-center w-[350px] text-md font-bold">{pos === 'Blue1' || pos === 'Blue2' ? 'Blue' : 'Red'} Alliance | Team {team}</p>

        {save && (
            <div className="absolute top-25  flex flex-col p-1 m-auto w-[350px] min-h-9/12 bg-slate-800 rounded-lg z-100 ">
                <div className="p-1 text-center font-black text-2xl">SAVING MATCH</div>
                <div className="p-1 text-center font-normal text-xl">{saveMsg}</div>
                <div className="p-1 text-center font-black text-xl">{saveRslt && saveRsltMsg}</div>
                <div className="p-1 text-center font-normal text-lg">{saveRslt && (
                  <Link href={`/scout/record/${eventid}`} >
                    <button className="bg-red-900 hover:bg-red-700 focus:bg-red-700 text-white font-black text-md py-2 px-4 rounded-xl w-[96%]">BACK TO MATCHES</button>
                  </Link>
              )}</div>
            </div>
        )}


        <div className="flex flex-col p-1 m-auto w-[350px] bg-slate-800 rounded-lg">
            <div className="m-1 grid grid-cols-2 grid-rows-1 justify-between p-1">
                
                <div className="row-start-1 col-start-1 col-span-1 text-white font-medium text-center text-sm">AUTO LEAVE</div>
                
                
                {!autoLeave ? (
                <div className="row-start-1 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-start justify-start p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setAutoLeave(!autoLeave)}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-red-700 border-4 border-red-900 rounded-full">&nbsp;</div>
                  </div>
                </div>
                ) : (
                <div className="row-start-1 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-end justify-end p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setAutoLeave(!autoLeave)}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-green-800 border-4 border-green-400 rounded-full">&nbsp;</div>
                  </div>
                </div>  
                )}
            </div>
        </div>
        <div className="m-1 p-1 w-[350px] bg-slate-800 rounded-lg">
            <div className="grid grid-cols-3 grid-rows-1 justify-between p-1">
                <div className="row-start-1 col-start-1 col-span-3 text-white font-medium text-center text-sm" >AUTO ARTIFACTS</div>
                <div className="row-start-2 col-start-1 col-span-1 text-white font-medium text-center" ><button className="bg-green-900 hover:bg-green-700  focus:bg-green-700 text-white font-black text-4xl py-2 px-4 rounded-xl w-[96%]" onClick={() => setAutoArtifacts(autoArtifacts + 1)}>+</button></div>
                <div className="row-start-2 col-start-2 col-span-1 text-white font-black text-center text-4xl" >{autoArtifacts}</div>
                <div className="row-start-2 col-start-3 col-span-1 text-white font-medium text-center" ><button className="bg-red-900 hover:bg-red-700  focus:bg-red-700 text-white font-black text-4xl py-2 px-4 rounded-xl w-[96%]" onClick={() => setAutoArtifacts(autoArtifacts - 1)}>-</button></div>
              </div>
        </div>
        <div className="m-1 p-1 w-[350px] bg-slate-800 rounded-lg">
            <div className="grid grid-cols-3 grid-rows-1 justify-between p-1">
                <div className="row-start-1 col-start-1 col-span-3 text-white font-medium text-center text-sm" >TELE ARTIFACTS</div>
                <div className="row-start-2 col-start-1 col-span-1 text-white font-medium text-center" ><button className="bg-green-900 hover:bg-green-700  focus:bg-green-700 text-white font-black text-4xl py-2 px-4 rounded-xl w-[96%]" onClick={() => setTeleArtifacts(teleArtifacts + 1)}>+</button></div>
                <div className="row-start-2 col-start-2 col-span-1 text-white font-black text-center text-4xl" >{teleArtifacts}</div>
                <div className="row-start-2 col-start-3 col-span-1 text-white font-medium text-center" ><button className="bg-red-900 hover:bg-red-700  focus:bg-red-700 text-white font-black text-4xl py-2 px-4 rounded-xl w-[96%]" onClick={() => setTeleArtifacts(teleArtifacts - 1)}>-</button></div>
              </div>
        </div>


        <div className="m-1 p-2 w-[350px] bg-slate-800 rounded-lg">
            <div className="grid grid-cols-2 grid-rows-2 justify-between p-1">
                <div className="row-start-1 col-start-1 col-span-3 text-white font-medium text-center text-sm" >TELE BASE</div>

                <div className="row-start-2 col-start-1 col-span-1 text-white font-medium text-center text-sm">FULL</div>
                <div className="row-start-3 col-start-1 col-span-1 text-white font-medium text-center text-sm">PARTIAL</div>


                
                {teleBase !== 'FULL' ? (
                <div className="my-1 row-start-2 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-start justify-start p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setTeleBase('FULL')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-red-700 border-4 border-red-900 rounded-full">&nbsp;</div>
                  </div>
                </div>
                ) : (
                <div className="my-1 row-start-2 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-end justify-end p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setTeleBase('NONE')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-green-800 border-4 border-green-400 rounded-full">&nbsp;</div>
                  </div>
                </div>  
                )}

                {teleBase !== 'PARTIAL' ? (
                <div className="my-1 row-start-3 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-start justify-start p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] h-[25px]" onClick={() => setTeleBase('PARTIAL')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-red-700 border-4 border-red-900 rounded-full">&nbsp;</div>
                  </div>
                </div>
                ) : (
                <div className="my-1 row-start-3 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-end justify-end p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setTeleBase('NONE')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-green-800 border-4 border-green-400 rounded-full">&nbsp;</div>
                  </div>
                </div>  
                )}

            </div>
        </div>

        <div className="m-1 p-2 w-[350px] bg-slate-800 rounded-lg">
            <div className="grid grid-cols-2 grid-rows-2 justify-between p-1">
                <div className="row-start-1 col-start-1 col-span-3 text-white font-medium text-center text-sm" >DOUBLE BASE CAPABLE</div>

                <div className="row-start-2 col-start-1 col-span-1 text-white font-medium text-center text-sm">RAISES / DRIVE UNDER</div>
                <div className="row-start-3 col-start-1 col-span-1 text-white font-medium text-center text-sm">LIFT / DRIVE OVER</div>


                
                {doubleBase !== 'RAISE' ? (
                <div className="my-1 row-start-2 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-start justify-start p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setDoubleBase('RAISE')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-red-700 border-4 border-red-900 rounded-full">&nbsp;</div>
                  </div>
                </div>
                ) : (
                <div className="my-1 row-start-2 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-end justify-end p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setDoubleBase('NONE')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-green-800 border-4 border-green-400 rounded-full">&nbsp;</div>
                  </div>
                </div>  
                )}

                {doubleBase !== 'LIFT' ? (
                <div className="my-1 row-start-3 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-start justify-start p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] h-[25px]" onClick={() => setDoubleBase('LIFT')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-red-700 border-4 border-red-900 rounded-full">&nbsp;</div>
                  </div>
                </div>
                ) : (
                <div className="my-1 row-start-3 col-start-2 col-span-1 place-items-center m-auto" >
                  <div className="flex place-items-end justify-end p-0 rounded-full bg-gray-900 border-2 border-gray-500 w-[50px] " onClick={() => setDoubleBase('NONE')}>
                    <div className="flex flex-col items-center justify-center w-[20px] h-[20px] bg-green-800 border-4 border-green-400 rounded-full">&nbsp;</div>
                  </div>
                </div>  
                )}

            </div>
        </div>


        <div className="flex flex-col p-2 m-auto w-[350px] bg-slate-800 rounded-lg">
            <div className="grid grid-cols-2 grid-rows-1 justify-between p-1">
                <div className="row-start-1 col-start-1 col-span-2 text-white font-medium text-center text-sm" >SUBMIT SCORES</div>
                <div className="row-start-2 col-start-1 col-span-1 text-white font-medium text-center" ><button className="bg-blue-900 hover:bg-blue-700 active:bg-blue-700 focus:bg-blue-700 text-white font-black text-4xl py-3 px-4 rounded-xl w-[96%]" onClick={() => setSave(!save)}>SAVE</button></div>
                <div className="row-start-2 col-start-2 col-span-1 text-white font-medium text-center" ><Link href={`/scout/record/${eventid}`} >
                  <button className="bg-red-900 hover:bg-red-700 focus:bg-red-700 text-white font-black text-md py-2 px-4 rounded-xl w-[96%]">CANCEL / BACK</button>
                </Link></div>  
              </div>
        </div>

        <p className="text-xs font-light italic text-center p-2 m-auto w-[400px]">Scout ID: {scoutID}</p>
    </div>
  )
}

