'use client'
import { use, useEffect, useState } from 'react'

interface EventItem 
    {
        code: string,
        regionCode: string,
        name: string,
        typeName: string,
        city: string,
        stateprov: string,
        country: string,
        weekStart: string,
        dateStart: string,
        dateEnd: string,
        teamsCount: number,
        teamsList: [
            {
                teamNumber: number,
                nameShort: string,
                schoolName: string,
                city: string,
                stateProv: string,
                country: string,
            }
        ],
    }

export default function Page({ params, }: { params: Promise<{ eventid: string }>}){
    const { eventid } = use(params)
    const [event, setEvent] = useState<EventItem>({code: 'loading', regionCode: '', name: '', typeName: '', city: '', stateprov: '', country: '', weekStart: '', dateStart: '', dateEnd: '', teamsCount: 0, teamsList: [{teamNumber: 0, nameShort: '', schoolName: '', city: '', stateProv: '', country: ''},]});

    useEffect(() => {
        fetch(`/api/decode/events/${eventid}`)
        .then(res => res.json())
        .then(data => {
            setEvent(data);
        })
        .catch(err => console.log(err));
    }, []);




  return (
    <div className='text-black p-2'>
        <h1 className="text-2xl font-black">{event.name}</h1>
        
    </div>
  )
}

