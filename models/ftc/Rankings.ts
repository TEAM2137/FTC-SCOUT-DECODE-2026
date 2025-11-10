import mongoose, { Schema, Document } from 'mongoose';


export interface IRankings extends Document
    {
      eventCode: string,
      rank: number,
      teamNumber: number,
      teamName: string,
      sortOrder1: number,
      sortOrder2: number,
      sortOrder3: number,
      sortOrder4: number,
      sortOrder5: number,
      sortOrder6: number,
      wins: number,
      losses: number,
      ties: number,
      qualAverage: number,
      dq: number,
      matchesPlayed: number,
      matchesCounted: number,
    }

const RankingsSchema: Schema = new Schema({
    eventCode: { type: String, required: true },
    rank: { type: Number, required: true },
    teamNumber: { type: Number, required: true },
    teamName: { type: String, required: true },
    sortOrder1: { type: Number, required: true },
    sortOrder2: { type: Number, required: true },
    sortOrder3: { type: Number, required: true },
    sortOrder4: { type: Number, required: true },
    sortOrder5: { type: Number, required: true },
    sortOrder6: { type: Number, required: true },
    wins: { type: Number, required: true },
    losses: { type: Number, required: true },
    ties: { type: Number, required: true },
    qualAverage: { type: Number, required: true },
    dq: { type: Number, required: true },
    matchesPlayed: { type: Number, required: true },
    matchesCounted: { type: Number, required: true },
});

const Rankings = mongoose.models?.Rankings || mongoose.model<IRankings>('Rankings', RankingsSchema);

export default Rankings;