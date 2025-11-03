export const dynamic = 'force-static';
export const revalidate = 120;

import connectDB from "@/lib/db"
import Schedule from "@/models/ftc-api/Schedule"


export async function GET( request: Request, { params }: { params: Promise<{ eventid: string, tournametlevel: string }>} ) {
    const event_key = (await params).eventid
    const level = (await params).tournametlevel

    //Update Schedule Fetch from FTC API could be added here
    let updateURL = ''
    if (level === 'Qualification') {
        updateURL = process.env.THIS_SERVER_URL + '/api/ftc-events/events/' + event_key + '/quals'
    } else {
        updateURL = process.env.THIS_SERVER_URL + '/api/ftc-events/events/' + event_key + '/playoffs'
    }
    const updateSchedule = await fetch(updateURL)
    
    if (updateSchedule.status === 200) {
        console.log('Schedule Updated from FTC-Events API')
    } else {
        console.log('Schedule Not Updated - Please check FTC-Events API')
    }

    const schedule = []
    
    try{
        await connectDB();
        const data = await Schedule.findOne({eventCode: event_key, tournamentLevel: level});
        for (let i = 0; i < data.schedule.length; i++ ) {
            const scheduleItem = data.schedule[i];
            schedule.push(scheduleItem);
        }
    } catch (err) {
        console.log(err)
    }
    
    

  return new Response(JSON.stringify(schedule), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })

}