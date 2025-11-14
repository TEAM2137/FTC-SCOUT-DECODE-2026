'use client'
import Link from 'next/link'
import Image from 'next/image'
import Event from '@/app/components/scout/Event'


import { use } from 'react'

import AllianceSelector from '@/app/components/scout/AllianceSelector'


const Page = ({ params, }: { params: Promise<{ eventCode: string }>}) => {
  const { eventCode } = use(params)

  return (
    <div className='mb-30 p-2'>
      <Event eventCode={eventCode} />

        <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between">
                <Link href={'/scout/event/'+eventCode+'/schedule'}>
                <button className="flex flex-row m-2 p-2 bg-slate-700 rounded-lg">
                    <Image src="/icons/orange-left.svg" alt="up"width={20} height={20} />
                    <span className="pl-1 font-bold text-sm">Back to Event Schedule</span>                
                </button>
                </Link>
            </div>
        </div>


      <h1 className='text-2xl font-bold my-2'>Alliance Selection Tool</h1>

      <AllianceSelector eventCode={eventCode} />

    </div>
  )
}

export default Page