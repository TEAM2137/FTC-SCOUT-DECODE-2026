'use server'

import connectDB from "@/lib/db"
import Event from "@/models/ftc-api/Event"

export async function GET( request: Request ) {

    await connectDB();
    const data = await Event.find().sort({ weekStart: 1 });

    const eventsData = [];
    for (let i = 0; i < data.length; i++ ) {
        const event = data[i];
        const eventData = {
            code: event.code,
            regionCode: event.regionCode,
            name: event.name,
            typeName: event.typeName,
            city: event.city,
            stateprov: event.stateprov,
            country: event.country,
            weekStart: event.weekStart,
            dateStart: event.dateStart,
            dateEnd: event.dateEnd,
            teamsCount: event.teamsList.length,
            teamsList: event.teamsList,
        }
        

        eventsData.push(eventData);
    }

  return new Response(JSON.stringify(eventsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}   