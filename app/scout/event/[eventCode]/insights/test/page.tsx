'use client'
import Event from '@/app/components/scout/Event'
import { TestChart } from '@/app/components/scout/TestChart'
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

      <div className='flex flex-row flex-wrap w-full'>
        {TeatData.map((team, index) => (
          <div key={index} className="w-2/2 sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <TestChart teamName={team.name} teamNumber={team.number} teamValue={team.value} teamAuto={team.auto} teamBase={team.base} teamArtifacts={team.artifacts} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Page