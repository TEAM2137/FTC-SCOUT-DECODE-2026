import mongoose, { Schema, Document } from 'mongoose';


export interface IAlliance extends Document
    {
    eventCode: string,
    number: number,
    name: string,
    captain: number,
    captainDisplay: string,
    round1: number,
    round1Display: string,
    round2: number,
    round2Display: string,
    round3: number,
    backup: number,
    backupReplaced: number
    }

const AllianceSchema: Schema = new Schema({
    eventCode: { type: String, required: true },
    number: { type: Number, required: true },
    name: { type: String, required: true },
    captain: { type: Number, required: true },
    captainDisplay: { type: String, required: true },
    round1: { type: Number, required: true },
    round1Display: { type: String, required: true },
    round2: { type: Number, required: true },
    round2Display: { type: String, required: true },
    round3: { type: Number, required: true },
    backup: { type: Number, required: true },
    backupReplaced: { type: Number, required: true },
});


const Alliance = mongoose.models?.Alliance || mongoose.model<IAlliance>('Alliance', AllianceSchema);

export default Alliance;