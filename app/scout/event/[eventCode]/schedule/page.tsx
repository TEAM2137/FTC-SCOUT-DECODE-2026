import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Event from "@/app/components/scout/Event";
import EventTeams from '@/app/components/scout/EventTeams';
import Schedule from '@/app/components/scout/Schedule';

export default function Page({ params, }: { params: Promise<{ eventCode: string }>}) {
    const { eventCode } = use(params)


  return (
    <div className="p-2 mb-30">
      
      <Event eventCode={eventCode} />

        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
                <Link href={'/scout/event/'+eventCode}>
                <button className="flex flex-row m-2 p-2 bg-slate-700 rounded-lg">
                    <Image src="/icons/orange-left.svg" alt="up"width={20} height={20} />
                    <span className="pl-1 font-bold text-sm">Back to Event Page</span>                
                </button>
                </Link>
            </div>
        </div>

    <Schedule eventCode={eventCode} />

      <EventTeams eventCode={eventCode} />
      
    </div>
  )
}