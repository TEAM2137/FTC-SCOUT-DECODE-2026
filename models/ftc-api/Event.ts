import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    code: string,
    divisionCode: string,
    name: string,
    remote: boolean,
    hybrid: boolean,
    fieldCount: number,
    published: boolean,
    type: string,
    typeName: string,
    regionCode: string,
    leagueCode: string,
    districtCode: string,
    venue: string,
    address: string,
    city: string,
    stateprov: string,
    country: string,
    website: string,
    liveStreamUrl: string,
    webcasts: string,
    timezone: string,
    weekStart: string,
    dateStart: string,
    dateEnd: string,
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

const EventSchema: Schema<IEvent> = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    divisionCode: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    remote: {
        type: Boolean,
        required: false
    },
    hybrid: {
        type: Boolean,
        required: false
    },
    fieldCount: {
        type: Number,
        required: false
    },
    published: {
        type: Boolean,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    typeName: {
        type: String,
        required: false
    },
    regionCode: {
        type: String,
        required: false
    },
    leagueCode: {
        type: String,
        required: false
    },
    districtCode: {
        type: String,
        required: false
    },
    venue: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    stateprov: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    liveStreamUrl: {
        type: String,
        required: false
    },
    webcasts: {
        type: String,
        required: false
    },
    timezone: {
        type: String,
        required: false
    },
    weekStart: {
        type: String,
        required: false
    },
    dateStart: {
        type: String,
        required: false
    },
    dateEnd: {
        type: String,
        required: false
    },
    teamsList: [{
        teamNumber: {
            type: Number,
            required: false,
        },
        nameShort: {
            type: String,
            required: false,
        },
        schoolName: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        stateProv: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
    }],
});


const Event = mongoose.models?.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;