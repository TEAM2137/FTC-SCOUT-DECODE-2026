'use client'

import { useState, useEffect } from 'react';
import Loading from '../ui/Loading';

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

function returnDate(date: string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dateObj = new Date(date);
    const month = months[dateObj.getMonth()];
    const day = days[dateObj.getDay()];
    const dayNumber = dateObj.getDate();
    const year = dateObj.getFullYear();
    return day + " (" +month + " " + dayNumber + ", " + year + ")";

}

export default function Event({ eventCode, display }: { eventCode: string, display?: string}) {
  const [event, setEvent] = useState<IEventItem>();
  const [eventLoaded, setEventLoaded] = useState<boolean>(false);
  const [displaySize, setDisplaySize] = useState<string>('full');

  

  useEffect(() => {
    fetch('/api/scout/events/' + eventCode)
    .then(res => res.json())
    .then(data => {
        setEvent(data);
        setEventLoaded(true);
    })
    .catch(err => console.log(err));
  }, [eventCode]);

  useEffect(() => {
    if (display === 'short') {
      setDisplaySize('short');
    } else if (display === 'small') {
      setDisplaySize('small');
    } else {
      setDisplaySize('full');
    }
  }, [display]);


  return (
    

    <div >
        {!eventLoaded &&  <Loading /> }

        {event && displaySize === 'full' &&
        
        <div>
            <h1 className="text-xl sm:text-3xl font-bold mb-2">{event.name}</h1>
            <p className="text-xs sm:text-lg italic">{returnDate(event.dateStart)} to {returnDate(event.dateEnd)}</p>
            <p className="text-xs sm:text-lg italic">{event.venue} | {event.city}, {event.stateprov}, {event.country}</p>
        </div>
        }

        {event && displaySize == 'short' &&
        <div>
            <h1 className="text-xl sm:text-3xl font-bold mb-2">{event.name}</h1>
        </div>
        }

        {event && displaySize == 'small' &&
        <div>
            <h1 className="text-sm sm:text-lg font-bold mb-2">{event.name}</h1>
        </div>
        }
        
    </div>
  )
}
