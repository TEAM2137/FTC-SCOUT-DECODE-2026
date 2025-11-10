import mongoose, { Schema, Document } from 'mongoose';


export interface IEvent extends Document 
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

const EventSchema: Schema = new Schema({
    eventCode: { type: String, required: true },
    divisionCode: { type: String, required: true },
    name: { type: String, required: true },
    published: { type: Boolean, required: true },
    typeName: { type: String, required: true },
    regionCode: { type: String, required: true },
    leagueCode: { type: String, required: true },
    districtCode: { type: String, required: true },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    stateprov: { type: String, required: true },
    country: { type: String, required: true },
    website: { type: String, required: false },
    liveStreamUrl: { type: String, required: false },
    weekStart: { type: String, required: false },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    teamList: [
        {
            teamNumber: { type: Number, required: false },
            nameShort: { type: String, required: false },
            city: { type: String, required: false },
            stateProv: { type: String, required: false },
            country: { type: String, required: false },
            homeRegion: { type: String, required: false },
        },
    ],
});

const Event = mongoose.models?.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;