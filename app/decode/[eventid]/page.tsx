'use client'
import { use } from 'react'



export default function Page({ params, }: { params: Promise<{ eventid: string }>}){
    const { eventid } = use(params)





  return (
    <div className='text-black'>Event: {eventid}</div>
  )
}

