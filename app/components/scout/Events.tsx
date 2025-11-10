'use client'

import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from 'react';
import Loading from "../ui/Loading";


interface IEventItem
{
    eventCode: string,
    divisionCode: string,
    name: string,
    published: boolean,
    typeName: string,
    regionCode: string,
    leagueCode: string,
    districtCode: string,
    venue: string,
    city: string,
    stateprov: string,
    country: string,
    website: string,
    liveStreamUrl: string,
    weekStart: string,
    dateStart: string,
    dateEnd: string,
    teamList: [
    {
        teamNumber: number,
        nameShort: string,
        city: string,
        stateProv: string,
        country: string,
    },
    ],
}

interface IEventWeeks {
    weekStart: string,
    events : IEventItem[],
}

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
    const [events, setEvents] = useState<IEventItem[]>([]);
    const [displayEvents, setDisplayEvents] = useState<IEventWeeks[]>([]);
    const [regions, setRegions] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);  
    const [reload, setReload] = useState<boolean>(false);
    const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
    const [showRegion, setShowRegion] = useState<string>('all');
    const [showEventType, setShowEventType] = useState<string>('Qualifier');
    const [showFilters, setShowFilters] = useState<boolean>(false);


    // Fetch Events from API
    useEffect(() => {
        fetch('/api/scout/events')
        .then(res => res.json())
        .then(data => {
            setEvents(data);
        })
        .then(() => setReload(true))
        .catch(err => console.log(err));
    },  []);

    // Update Display Events to sort by week when filter changes
    useEffect(() => {
        if (reload) {
            const displayEvents: IEventWeeks[] = [];
            let currentStartWeek: string = 'none';
            let weekEvents: IEventItem[] = [];
            

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

            const types: string[] = [];
            const typesExclude: string[] = ['Demo / Exhibition', 'Kickoff', 'Volunteer Signup'];
            for (let i = 0; i < events.length; i++ ) {
                const event = events[i];
                if (!types.includes(event.typeName)) {
                    if (typesExclude.includes(event.typeName)) continue;
                    types.push(event.typeName)
                } 
            }
            types.sort();
            setTypes(types);

            const typeFilteredEvents = events.filter((event: IEventItem) => {
                return event.typeName === showEventType || (showEventType === 'all' && !typesExclude.includes(event.typeName));
            });

            const regions: string[] = []
            for (let i = 0; i < typeFilteredEvents.length; i++ ) {
                const event = typeFilteredEvents[i];
                if (!regions.includes(event.regionCode)) regions.push(event.regionCode)
            }
            regions.sort();
            setRegions(regions);

            const regionFilteredEvents = typeFilteredEvents.filter((event: IEventItem) => {
                return event.regionCode === showRegion || showRegion === 'all';
            });

            for (let i = 0; i < regionFilteredEvents.length; i++ ) {
                const event = regionFilteredEvents[i];
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

            const dateFilteredEvents = displayEvents.filter((week: IEventWeeks) => {
                return currentdatecomp <= returnDateComp(week.weekStart) || showPastEvents;
            });

            setDisplayEvents(dateFilteredEvents);
            setReload(false);
        }
    }, [events, reload]);

    useEffect(() => {
        setReload(true);
        setShowFilters(false);
    }, [showRegion, showPastEvents, showEventType])

return (
    <div className='grid grid-cols-[50px_1fr] w-full text-white'>

{displayEvents.length < 1 ? 
(
    <Loading />
)

: (<>

        <div className="cols-start-1 w-full text-lg mb-30 justify-center place-items-center">
            

            <div className={!showFilters ? "hidden" : "absolute left-[50px] bg-slate-800 p-2 z-50" }>
            <button className="bg-blue-800 p-1 m-2 w-[90%] rounded-lg" onClick={() => setShowPastEvents(!showPastEvents)}>{showPastEvents ? 'Show Only Upcoming Events' : 'Show Past Events'}</button>
            <button className="bg-blue-800 p-1 m-2 w-[90%] rounded-lg" onClick={() => setShowEventType('all')}>ALL Events</button>
            <div className="flex-row w-[90%]">
            {types.map((type, i: number) => (
                <button key={i+'type'} className="bg-blue-800 p-1 m-1  rounded-lg" onClick={() => setShowEventType(type)}>{type}</button>
            ))}
            </div>
            <button className="bg-blue-800 p-1 m-2 w-[90%] rounded-lg" onClick={() => setShowRegion('all')}>ALL Regions</button>
            <div className="flex-row w-[90%]">
            {regions.map((region, i: number) => (
                <button key={i+'region'} className="bg-blue-800 p-1 m-1 text-lg rounded-lg" onClick={() => setShowRegion(region)}>{region}</button>
            ))}
            </div>

            </div>

            <button className="p-2 mx-auto" onClick={()=>setShowFilters(!showFilters)}>
            <Image src="/ui/filtericon.svg" alt="logo" width={30} height={30} />
            </button>
        </div>


        <div className="cols-start-2 p-2 flex flex-row flex-wrap w-full justify-start place-items-start mb-30">
            <h1 className="text-xl font-bold mb-2">Events <span className="text-sm font-normal">({showPastEvents ? 'All' : 'Upcoming'} {showEventType === 'all' ? 'Events' : showEventType + ' Events'} {showRegion === 'all' ? '' : 'in ' + showRegion + ' Region'})</span></h1>
            <div className="flex flex-row flex-wrap w-full">
            {displayEvents.map((week, i: number) => (
                <div key={i+'week'} className="flex flex-col mr-2 mb-2 w-[350px] sm:w-[600px] bg-slate-700 rounded-lg">
                <h1 className="p-2">{returnDate(week.weekStart)}</h1>
                <div className="w-full h-full bg-slate-50 text-gray-800 rounded-b-lg p-1">
                    {week.events.map((event, i: number) => (
                        <Link key={i+'eventLink'} href={'/scout/event/' + event.eventCode}>
                        <div className="grid grid-cols-[50px_1fr_1fr] sm:grid-cols-[50px_1fr_1fr_90px_40px] gap-1 py-1 hover:bg-slate-200">
                            <div className="text-xs font-normal justify-end my-auto">{event.regionCode}</div>
                            <div className="text-md font-bold justify-end my-auto">{event.name}</div>
                            <div className="text-xs font-normal justify-end my-auto">{event.city}, {event.stateprov}, {event.country}</div>
                            <div className="hidden sm:block text-xs font-normal justify-end my-auto">{returnDate(event.dateStart)}</div>
                            <div className="hidden sm:block text-xs font-normal justify-end my-auto text-center"><span className="font-bold text-sm">{event.teamList.length}</span> Teams</div>
                        </div></Link>
                    ))}
                </div>
            </div>
            ))}</div>
        </div>


        
</>)}


        
        
    </div>
  )
}

export default Events