import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
    teamNumber: number,
    displayTeamNumber: string,
    nameFull: string,
    nameShort: string,
    schoolName: string,
    city: string,
    stateProv: string,
    country: string,
    website: string,
    rookieYear: number,
    robotName: string,
    districtCode: string,
    homeCMP: string,
    homeRegion: string,
    displayLocation: string
}

const TeamSchema: Schema<ITeam> = new Schema({
    teamNumber: {
        type: Number,
        required: true,
        unique: true
    },
    displayTeamNumber: {
        type: String,
        required: false
    },
    nameFull: {
        type: String,
        required: false
    },
    nameShort: {
        type: String,
        required: false
    },
    schoolName: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    stateProv: {
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
    rookieYear: {
        type: Number,
        required: false
    },
    robotName: {
        type: String,
        required: false
    },
    districtCode: {
        type: String,
        required: false
    },
    homeCMP: {
        type: String,
        required: false
    },
    homeRegion: {
        type: String,
        required: false
    },
    displayLocation: {
        type: String,
        required: false
    }
});


const Team = mongoose.models?.Team || mongoose.model<ITeam>('Team', TeamSchema);

export default Team;