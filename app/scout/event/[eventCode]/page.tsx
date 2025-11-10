import { use } from 'react';
import Event from "@/app/components/scout/Event";
import Rankings from '@/app/components/scout/Rankings';
import EventTeams from '@/app/components/scout/EventTeams';
import Awards from '@/app/components/scout/Awards';
import Alliances from '@/app/components/scout/Alliances';
import Link from 'next/link';
import Image from 'next/image';

export default function Page({ params, }: { params: Promise<{ eventCode: string }>}) {
    const { eventCode } = use(params)


  return (
    <div className="p-2 mb-30">
      
      <Event eventCode={eventCode}  />

      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <Link href={'/scout/event/'+eventCode+'/schedule'}>
          <button className="flex flex-row m-2 p-2 bg-slate-700 rounded-lg">
            <span className="pr-1 font-bold text-sm">Match Schedule & Results</span>
            <Image src="/icons/orange-right.svg" alt="up"width={20} height={20} />
          </button>
          </Link>
        </div>
      </div>

      <Awards eventCode={eventCode} />
      <Alliances eventCode={eventCode} />
      <Rankings eventCode={eventCode} />
      <EventTeams eventCode={eventCode} />
      
    </div>
  )
}