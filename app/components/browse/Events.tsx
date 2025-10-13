

import { useState, useEffect, use } from "react";

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

    const slectedSyle = 'bg-slate-900  hover:bg-blue-700 text-white text-sm font-normal py-1 px-2 rounded-full';
    const unselectedStyle = 'bg-slate-600  hover:bg-blue-700 text-white text-sm font-normal py-1 px-2 rounded-full';


const Events = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [displayEvents, setDisplayEvents] = useState<EventItem[]>([]);
    const [viewScrims, setViewScrims] = useState<boolean>(false);
    const [viewLeagues, setViewLeagues] = useState<boolean>(false);
    const [viewQuals, setViewQuals] = useState<boolean>(true);
    const [viewChamps, setViewChamps] = useState<boolean>(false);
    const [viewEvents, setViewEvents] = useState<string[]>(['Qualifier', 'Championship']);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        fetch('/api/decode/events')
        .then(res => res.json())
        .then(data => {
            setEvents(data);
        })
        .then(() => setReload(true))
        .catch(err => console.log(err));
        
    },  []);

    useEffect(() => {
        const viewfilter: string[] = [];
        if (viewScrims) { viewfilter.push('Scrimmage'); }
        if (viewLeagues) { viewfilter.push('League Meet'); }
        if (viewQuals) { viewfilter.push('Qualifier'); }
        if (viewChamps) { viewfilter.push('Championship'); }
        setViewEvents(viewfilter);
        setReload(true);
    }, [viewScrims, viewLeagues, viewQuals, viewChamps]);

    function returnDate(date: string) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        return month + "/" + day+ "/" + year;
    }


    useEffect(() => {        
        if (reload) {
            setReload(false);
            const displayEvents: EventItem[] = [];
            for (let i = 0; i < events.length; i++ ) {
                const event = events[i];
                if (viewEvents.includes(event.typeName)) {
                    displayEvents.push(event);
                } else if (viewEvents.length === 0) {
                    displayEvents.push(event);
                }
            }
            //console.log("Display Events:", displayEvents);
            setDisplayEvents(displayEvents);
        }
    }, [reload, viewEvents, events]);

  return (
    <div className="text-slate-950 p-4 mx-auto min-w-[98%]">
        <h1 className="text-2xl font-black">FTC Events</h1>
        <h2>Select View ({viewEvents.join(', ')})</h2>
        <div className="flex flex-row gap-1">
            <button className={viewScrims ? slectedSyle : unselectedStyle} onClick={() => setViewScrims(!viewScrims)}>Scrimmages</button>
            <button className={viewLeagues ? slectedSyle : unselectedStyle} onClick={() => setViewLeagues(!viewLeagues)}>League Meets</button>
            <button className={viewQuals ? slectedSyle : unselectedStyle} onClick={() => setViewQuals(!viewQuals)}>Qualifiers</button>
            <button className={viewChamps ? slectedSyle : unselectedStyle} onClick={() => setViewChamps(!viewChamps)}>Championships</button>
        </div>
        {displayEvents.length === 0 ? (
            <p>No Events to display, try adjusting your filters.</p>
        ) : (
            <table className="text-sm font-normal">
                <tbody>
                {displayEvents.map((event, index: number) => (
                    <tr key={index}>
                        
                        <td className="pr-1">{event.regionCode}</td>
                        <td className="pr-1">{event.name}</td>

                        <td className="pr-1">{event.country}</td>
                        <td className="pr-1">{returnDate(event.weekStart)}</td>
                        <td className="pr-1">{returnDate(event.dateStart)}</td>
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