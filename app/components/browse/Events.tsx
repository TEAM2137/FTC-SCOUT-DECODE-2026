

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

    interface EventWeeks {
        weekStart: string,
        events : EventItem[],

    }

    const slectedSyle = 'bg-slate-900  hover:bg-blue-700 text-white text-sm font-normal py-1 px-2 rounded-full';
    const unselectedStyle = 'bg-slate-600  hover:bg-blue-700 text-white text-sm font-normal py-1 px-2 rounded-full';


const Events = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [displayEvents, setDisplayEvents] = useState<EventWeeks[]>([]);
    const [viewScrims, setViewScrims] = useState<boolean>(false);
    const [viewLeagues, setViewLeagues] = useState<boolean>(false);
    const [viewQuals, setViewQuals] = useState<boolean>(true);
    const [viewChamps, setViewChamps] = useState<boolean>(false);
    const [viewEvents, setViewEvents] = useState<string[]>(['Qualifier', 'Championship']);
    const [viewFuture, setViewFuture] = useState<boolean>(true);
    const [viewPast, setViewPast] = useState<boolean>(false);
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

    useEffect(() => {
        setReload(true);
    }, [viewFuture, viewPast]);

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
            const includeEvents: EventItem[] = [];

            const today = new Date();
            const weekDate = today;
            let dayOfWeek = today.getDay();
            if (dayOfWeek == 0) {
                dayOfWeek = 7
            }
            const seconds = (dayOfWeek - 1)* 86400
            weekDate.setSeconds(weekDate.getSeconds() - seconds);
            const weekString = weekDate.getFullYear().toString().padStart(4, '0') + "-" + (weekDate.getMonth() + 1).toString().padStart(2, '0') + "-" + weekDate.getDate().toString().padStart(2, '0') + "T00:00:00"

            const currentWeekSeconds = new Date(weekString).getSeconds();

            for (let i = 0; i < events.length; i++ ) {
                const event = events[i];
                const eventWeekSeconds = new Date(event.weekStart).getSeconds();
                let includeByType = false;
                let includebyDate = false;


                if (viewEvents.includes(event.typeName)) {
                    includeByType= true;
                } else if (viewEvents.length === 0) {
                    includeByType = true;
                } else {
                    includeByType = false;
                }

                if (viewFuture && eventWeekSeconds >= currentWeekSeconds) {
                    includebyDate = true;
                }
                if (viewPast && eventWeekSeconds < currentWeekSeconds) {
                    includebyDate = true;
                }


                if (includeByType && includebyDate) {
                    includeEvents.push(event);
                }
            }

            const displayEvents: EventWeeks[] = [];
            let currentStartWeek: string = 'none';
            let weekEvents: EventItem[] = [];

            for (let i = 0; i < includeEvents.length; i++ ) {
                const event = includeEvents[i];
                const weekStart = event.weekStart;
                
                if (weekStart !== currentStartWeek) {
                    if (currentStartWeek !== 'none') {
                    displayEvents.push({weekStart: currentStartWeek, events: weekEvents});
                    weekEvents = [];
                    }
                } 
                currentStartWeek = weekStart;
                weekEvents.push(event);
                
            }
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
        <div className="flex flex-row gap-1">
            <button className={viewFuture ? slectedSyle : unselectedStyle} onClick={() => setViewFuture(!viewFuture)}>Future Events</button>
            <button className={viewPast ? slectedSyle : unselectedStyle} onClick={() => setViewPast(!viewPast)}>Past Events</button>
        </div>
        {displayEvents.length === 0 ? (
            <p>No Events to display, try adjusting your filters.</p>
        ) : (
           
            displayEvents.map((eventWeek, index: number) => (
                <div key={index}>
                    <h2 className="text-2xl font-black">{eventWeek.weekStart}</h2>

                </div>
            ))
            
        )}


    </div>
  )
}

export default Events