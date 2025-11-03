import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchScore extends Document {
      scoutID: string,
      scoutTeam: string,
      scoutName: string,
      eventid: string,
      tournamentLevel: string,
      matchNumber: number,
      teamNumber: number,
      station: string,
      autoArtifacts: number,
      teleArtifacts: number,
      autoLeave: number,
      teleBaseFull: number,
      teleBasePartial: number,
      doubleBaseRaise: number,
      doubleBaseLift: number,
      score: number,
      use: boolean,
}

const MatchScoreSchema: Schema<IMatchScore> = new Schema({
    scoutID: {
        type: String,
        required: true,
        unique: true
    },
    scoutTeam: {
        type: String,
        required: true,
    },
    scoutName: {
        type: String,
        required: true,
    },
    eventid: {
        type: String,
        required: true,
    },
    tournamentLevel: {
        type: String,
        required: true,
    },
    matchNumber: {
        type: Number,
        required: true,
    },
    teamNumber: {
        type: Number,
        required: true,
    },
    station: {
        type: String,
        required: true,
    },
    autoArtifacts: {
        type: Number,
        required: false,
        default: 0,
    },
    teleArtifacts: {
        type: Number,
        required: false,
        default: 0,
    },
    autoLeave: {
        type: Number,
        required: false,
        default: 0,
    },
    teleBaseFull: {
        type: Number,
        required: false,
        default: 0,
    },
    teleBasePartial: {
        type: Number,
        required:  false,
        default: 0,
    },
    doubleBaseRaise: {
        type: Number,
        required:  false,
        default: 0,
    },
    doubleBaseLift: {
        type: Number,
        required:   false,
        default: 0,
    },
    score: {
        type: Number,
        required:    false,
        default: 0,
    },
    use: {
        type: Boolean,
        required: false,
        default: true,
    },
})

const MatchScore = mongoose.models?.MatchScore || mongoose.model<IMatchScore>('MatchScore', MatchScoreSchema);

export default MatchScore;