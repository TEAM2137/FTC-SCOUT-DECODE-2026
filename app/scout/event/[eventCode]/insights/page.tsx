'use client'
import Event from '@/app/components/scout/Event'
import SummaryGraph from '@/app/components/scout/SummaryGraph'

import { use } from 'react'


interface ITeamData {
  number: string
  name: string
  value: number
  auto: number
  base: number
  artifacts: number
}


const TeatData: ITeamData[] = []

for (let i = 0; i < 35; i++) {
  TeatData.push({
    number: Math.floor(Math.random() * 10000).toString(),
    name: "Team " + (1+i).toString(),
    value: Math.floor(Math.random() * 100),
    auto: Math.floor(Math.random() * 10),
    base: Math.floor(Math.random() * 10),
    artifacts: Math.floor(Math.random() * 10),
  })
}



const Page = ({ params, }: { params: Promise<{ eventCode: string }>}) => {
  const { eventCode } = use(params)

  return (
    <div className='mb-30 p-2'>
      <Event eventCode={eventCode} />

      <h1 className='text-2xl font-bold my-2'>Insights</h1>

      <SummaryGraph eventCode={eventCode} />

    </div>
  )
}

export default Page