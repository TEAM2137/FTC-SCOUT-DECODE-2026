
import connectDB from "@/lib/db"
import Event from "@/models/ftc/Event"


export async function GET() {

  // Set API Path to FRC Events API
  const apiPath = process.env.FTC_API_URL + '/2025/events'
  // Set Headers for API Auth
  const headers = {
    'Authorization': `Basic ${process.env.FTC_API_KEY}`,
    'Content-Type': 'application/json'
  }
  // Fetch Events from API
  const response = await fetch(apiPath, {
    headers: headers, cache: 'force-cache', next: { revalidate: 86400 }
  })
  const data = await response.json()

  const events = data.events
  const newEvents = [];

  for (let i = 0; i < events.length; i++ ) {
    
    try {
        await connectDB()

        const startDate = new Date(events[i].dateStart)
        //console.log("Day Of Week:", startDate.getDay())
        //console.log("Start Date:", startDate.toLocaleString())
        const weekDate = startDate
        let dayOfWeek = startDate.getDay()
        if (dayOfWeek == 0) {
            dayOfWeek = 7
        }
        const seconds = (dayOfWeek - 1)* 86400
        weekDate.setSeconds(weekDate.getSeconds() - seconds)
        //console.log("Start Date:", events[i].dateStart)
        //console.log("Week Date:", weekDate.toLocaleString())
        const weekString = weekDate.getFullYear().toString().padStart(4, '0') + "-" + (weekDate.getMonth() + 1).toString().padStart(2, '0') + "-" + weekDate.getDate().toString().padStart(2, '0') + "T00:00:00"
        //console.log("Week Start:", weekString)

        // Get teams for event
        const apiPath = process.env.FTC_API_URL + '/2025/teams?eventCode=' + events[i].code
        console.log("API Path:", apiPath) 
        const response = await fetch(apiPath, {
            headers: headers
        })
        const data = await response.json()
        const teams = data.teams
        //console.log("Teams:", teams)

        const eventTeams = [];
        if (teams) {
          for (let i = 0; i < teams.length; i++ ) {
            const newteam = {
                teamNumber: teams[i].teamNumber,
                nameShort: teams[i].nameShort,
                city: teams[i].city,
                stateProv: teams[i].stateProv,
                country: teams[i].country,
            }
            eventTeams.push(newteam)
          }
        }

        //console.log("Event Teams:", eventTeams) 


        const newEvent = 
            {
                eventCode: events[i].code,
                divisionCode: events[i].divisionCode,
                name: events[i].name,
                published: events[i].published,
                typeName: events[i].typeName,
                regionCode: events[i].regionCode,
                leagueCode: events[i].leagueCode,
                districtCode: events[i].districtCode,
                venue: events[i].venue,
                city: events[i].city,
                stateprov: events[i].stateprov,
                country: events[i].country,
                website: events[i].website,
                liveStreamUrl: events[i].liveStreamUrl,
                weekStart: weekString,
                dateStart: events[i].dateStart,
                dateEnd: events[i].dateEnd,
                teamList: eventTeams,
            }

        const updateEvent = await Event.findOneAndUpdate({ eventCode: newEvent.eventCode }, newEvent, { upsert: true });
        newEvents.push(updateEvent)
    } catch (err) {
        console.log(err)
    }
  }

const result = { updated: true, message: "Events Updated", NumberOfEvents: newEvents.length };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}