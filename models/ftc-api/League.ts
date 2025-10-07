import mongoose, { Schema, Document } from 'mongoose';

export interface ILeague extends Document {
    region: string;
    code: string;
    name: string;
    remote: boolean,
    parentLeagueCode: string;
    parentLeagueName: string;
    location: string;
}

const LeagueSchema: Schema<ILeague> = new Schema({
    region: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    remote: {
        type: Boolean,
        required: true
    },
    parentLeagueCode: {
        type: String,
        required: false
    },
    parentLeagueName: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    }
});


const League = mongoose.models?.League || mongoose.model<ILeague>('League', LeagueSchema);

export default League;