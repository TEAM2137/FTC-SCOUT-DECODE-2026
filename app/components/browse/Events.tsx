'use client';
import Link from "next/link";
import { useState, useEffect} from "react";

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

    const slectedSyle = 'bg-slate-900  hover:bg-blue-700 text-white text-xs font-normal py-1 px-2 rounded-full';
    const unselectedStyle = 'bg-slate-600  hover:bg-blue-700 text-white text-xs font-normal py-1 px-2 rounded-full';

    function returnDate(date: string) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        return month + "/" + day+ "/" + year;
    }

    function returnDateComp(date: string) {
        const dateObj = new Date(date);
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const datecomp = year * 10000 + month * 100 + day;
        return datecomp;
    }




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
    const [region, setRegion] = useState<string>('');
    const [regionList, setRegionList] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);
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


    useEffect(() => {        
        if (reload) {
            setReload(false);
            const includeEvents: EventItem[] = [];
            const regions: string[] = []

            const today = new Date();
            const weekDate = today;
            let dayOfWeek = today.getDay();
            if (dayOfWeek == 0) {
                dayOfWeek = 7
            }
            const seconds = (dayOfWeek - 1)* 86400
            weekDate.setSeconds(weekDate.getSeconds() - seconds);
            const weekString = weekDate.getFullYear().toString().padStart(4, '0') + "-" + (weekDate.getMonth() + 1).toString().padStart(2, '0') + "-" + weekDate.getDate().toString().padStart(2, '0') + "T00:00:00"
            const currentdatecomp = returnDateComp(weekString);
            

            for (let i = 0; i < events.length; i++ ) {
                const event = events[i];
                const eventdatecomp = returnDateComp(event.weekStart)

                let includeByType = false
                let includebyDate = false
                let includeByRegion = false



                if (viewEvents.includes(event.typeName)) {
                    includeByType = true;
                } 

                if (eventdatecomp >= currentdatecomp && viewFuture) {
                    includebyDate = true;
                }
                if (eventdatecomp < currentdatecomp && viewPast) {
                    includebyDate = true;
                }

                if (region === '') {
                    includeByRegion = true
                } else if (event.regionCode === region) {
                    includeByRegion = true
                } else {
                    includeByRegion = false
                }


                if (includeByType && includebyDate) {
                    if (!regions.includes(event.regionCode)) {
                        regions.push(event.regionCode)
                    }
                }


                if (includeByType && includebyDate && includeByRegion) {
                    includeEvents.push(event);
                }
            }

            setRegionList(regions);

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

    function setUnsetRegion(newregion: string) {
        if (region === newregion) {
            setRegion('');
        } else {
            setRegion(newregion);
        }
        setReload(true);
    }

  return (
    <div className="text-slate-950 p-4 mx-auto min-w-[98%] bg-slate-200">
        <div className="flex flex-row flex-wrap gap-1 border-b-2 w-[100%] border-slate-400 pb-2 mb-2">
            <div className="flex"><h1 className="text-2xl font-black">FTC Events</h1></div>
            <div className="flex place-self-end ml-auto"><button className={showFilters ? slectedSyle : unselectedStyle} onClick={() => setShowFilters(!showFilters)}>Filters</button></div>
        </div>
        {showFilters && ( <>
        <div className="flex flex-col gap-1 flex-wrap">
            <div className="flex flex-row flex-wrap gap-1 border-b-2 border-slate-400 pb-2 mb-2">
                <h3>Event Types: </h3>
                <button className={viewScrims ? slectedSyle : unselectedStyle} onClick={() => setViewScrims(!viewScrims)}>Scrimmages</button>
                <button className={viewLeagues ? slectedSyle : unselectedStyle} onClick={() => setViewLeagues(!viewLeagues)}>League Meets</button>
                <button className={viewQuals ? slectedSyle : unselectedStyle} onClick={() => setViewQuals(!viewQuals)}>Qualifiers</button>
                <button className={viewChamps ? slectedSyle : unselectedStyle} onClick={() => setViewChamps(!viewChamps)}>Championships</button>
            </div>
            <div className="flex flex-row flex-wrap gap-1 border-b-2 border-slate-400 pb-2 mb-2">
                <h3>By When: </h3>
                <button className={viewFuture ? slectedSyle : unselectedStyle} onClick={() => setViewFuture(!viewFuture)}>Future Events</button>
                <button className={viewPast ? slectedSyle : unselectedStyle} onClick={() => setViewPast(!viewPast)}>Past Events</button>
            </div>
            <div className="flex flex-row flex-wrap gap-1 border-b-2 border-slate-400 pb-2 mb-2">
                <h3 className="w-[100%]">By Region: </h3>
                {regionList.map((regionItem, index: number) => (
                    <button key={index} className={region === regionItem ? slectedSyle : unselectedStyle} onClick={() => setUnsetRegion(regionItem)}>{regionItem}</button>
                ))}
             </div>
        </div>
        </> )}


        <div className="flex flex-row gap-1 flex-wrap">
        {displayEvents.length === 0 ? (<p>
            {events.length === 0 ? (<>
                Loading events...</>
            ) : (<>
                No Events to display, try adjusting your filters.</>
            )}
            </p>
        ) : (
           
            displayEvents.map((eventWeek, index: number) => (
                <div key={index} className="flex flex-col w-[100%] sm:w-[48%] lg:w-[33%] xl:w-[24%] p-1">
                    <div key={index} className="flex flex-col bg-slate-600 rounded-lg p-1 shadow-lg">
                    <h2 className="text-sm font-bold text-slate-200 pl-2">WEEK OF {returnDate(eventWeek.weekStart)}</h2>
                    {eventWeek.events.map((event, index: number) => (
                        <div key={index} className="flex flex-row gap-2 p-2 w-[100%] bg-slate-100 mb-1 rounded-md">
                            <div className="min-w-[12%]"><div className="text-xs font-light bg-slate-900 rounded-lg p-0.5 text-white text-center">{event.regionCode}</div></div>
                            <div className="text-sm font-bold">
                                <Link href={`/decode/${event.code}`}>{event.name}</Link>
                                </div>
                            <div className="text-xs font-normal">{event.teamsCount} Teams</div>
                        </div>
                    ))} 
                    </div>
                </div>
            ))
            
        )}
        </div>

    </div>
  )
}

export default Events