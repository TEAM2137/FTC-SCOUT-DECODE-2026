

import { useState, useEffect } from "react";

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



const Events = () => {
    const [events, setEvents] = useState<EventItem[]>([]);

    useEffect(() => {
        fetch('/api/decode/events')
        .then(res => res.json())
        .then(data => {
            setEvents(data);
        })
        .catch(err => console.log(err));
    }, []);

  return (
    <div className="text-slate-950 p-4 mx-auto min-w-[98%]">
        <h1 className="text-2xl font-black">FTC Qualifier Events</h1>

        {events.length === 0 ? (
            <p>Loading events...</p>
        ) : (
            <table className="text-sm font-normal">
                <tbody>
                {events.filter(function(event){return event.typeName == 'Qualifier'}).map((event, index: number) => (
                    <tr key={index}>
                        <td className="pr-1">{event.code}</td>
                        <td className="pr-1">{event.regionCode}</td>
                        <td className="pr-1">{event.name}</td>
                        <td className="pr-1">{event.typeName}</td>
                        <td className="pr-1">{event.city}</td>
                        <td className="pr-1">{event.stateprov}</td>
                        <td className="pr-1">{event.country}</td>
                        <td className="pr-1">{event.weekStart}</td>
                        <td className="pr-1">{event.dateStart}</td>
                        <td className="pr-1">{event.teamsList.length}</td>

                    </tr>
                ))}
                </tbody>
            </table>
        )}


    </div>
  )
}

export default Events