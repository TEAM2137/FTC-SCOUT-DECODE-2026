import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchScore extends Document {
      scoutID: string,
      scoutTeam: string,
      scoutName: string,
      eventCode: string,
      matchLevel: string,
      matchNumber: number,
      matchSeries: number,
      teamNumber: number,
      autoArtifacts: number,
      teleArtifacts: number,
      autoLeave: number,
      teleBaseFull: number,
      teleBasePartial: number,
      doubleBaseRaise: number,
      doubleBaseLift: number,
      score: number,
      ignore: boolean,
      hide: boolean,
}

const MatchScoreSchema: Schema<IMatchScore> = new Schema({
    scoutID: { type: String, required: true },
    scoutTeam: { type: String, required: true },
    scoutName: { type: String, required: true },
    eventCode: { type: String, required: true },
    matchLevel: { type: String, required: true },
    matchNumber: { type: Number, required: true },
    matchSeries: { type: Number, required: true },
    teamNumber: { type: Number, required: true },
    autoArtifacts: { type: Number, required: true },
    teleArtifacts: { type: Number, required: true },
    autoLeave: { type: Number, required: true },
    teleBaseFull: { type: Number, required: true },
    teleBasePartial: { type: Number, required: true },
    doubleBaseRaise: { type: Number, required: true },
    doubleBaseLift: { type: Number, required: true },
    score: { type: Number, required: true },
    ignore: { type: Boolean, required: true },
    hide: { type: Boolean, required: true },
});


const MatchScore = mongoose.models?.MatchScore || mongoose.model<IMatchScore>('MatchScore', MatchScoreSchema);

export default MatchScore;