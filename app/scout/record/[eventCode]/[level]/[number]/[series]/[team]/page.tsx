import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Event from "@/app/components/scout/Event";
import Record from '@/app/components/scout/Record';


export default function Page({ params, }: { params: Promise<{ eventCode: string, level: string, number: number, series: number, team: number }>}) {
    const { eventCode, level, number, series, team } = use(params)


  return (
    <div className="p-2 mb-30">
      
      <div className="absolute right-0">
          <div className="flex flex-row justify-between">
              <Link href={'/scout/event/'+eventCode+'/schedule/match/'+level+'/'+number+'/'+series}>
              <button className="flex flex-row m-2 p-2 bg-slate-700 rounded-lg">
                  <Image src="/icons/orange-left.svg" alt="up"width={20} height={20} />
                  <span className="pl-1 font-bold text-sm">Back to Match</span>                
              </button>
              </Link>
          </div>
      </div>
       
    <Event eventCode={eventCode} display="small" />
    <p className="text-xs sm:text-lg"> Scouting {level === 'QUALIFICATION' ? 'Qualification' : 'Elimination'} Match {number} | Team {team}</p>   
      

    <Record eventCode={eventCode} level={level} number={number} series={series} team={team} />
      
      
    </div>
  )
}