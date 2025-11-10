import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamEventMatchSummary extends Document {
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    teamNumber: number,
    teamName: string,
    alliance: string,
    station: string,
    allianceWon: number,
    allianceLost: number,
    allianceTied: number,
    allianceAuto: number,
    allianceFinal: number,
    allianceFoul: number,
    autoLeave: number,
    teleBase: string,
    autoArtifacts: number,
    teleArtifacts: number,
    doubleBaseRaise: number,
    doubleBaseLift: number,
    score: number,
    totalArtifacts: number,
    scoutAutoLeave: number,
    scoutTeleBasePartial: number,
    scoutTeleBaseFull: number,
}

const TeamEventMatchSummarySchema: Schema<ITeamEventMatchSummary> = new Schema({
    eventCode: { type: String, required: true },
    matchLevel: { type: String, required: true },
    matchNumber: { type: Number, required: true },
    matchSeries: { type: Number, required: true },
    teamNumber: { type: Number, required: true },
    teamName: { type: String, required: true },
    alliance: { type: String, required: true },
    station: { type: String, required: true },
    allianceWon: { type: Number, required: true },
    allianceLost: { type: Number, required: true },
    allianceTied: { type: Number, required: true },
    allianceAuto: { type: Number, required: true },
    allianceFinal: { type: Number, required: true },
    allianceFoul: { type: Number, required: true },
    autoLeave: { type: Number, required: true },
    teleBase: { type: String, required: true },
    autoArtifacts: { type: Number, required: true },
    teleArtifacts: { type: Number, required: true },
    doubleBaseRaise: { type: Number, required: true },
    doubleBaseLift: { type: Number, required: true },
    score: { type: Number, required: true },
    totalArtifacts: { type: Number, required: true },
    scoutAutoLeave: { type: Number, required: true },
    scoutTeleBasePartial: { type: Number, required: true },
    scoutTeleBaseFull: { type: Number, required: true },
});


const TeamEventMatchSummary = mongoose.models?.TeamEventMatchSummary || mongoose.model<ITeamEventMatchSummary>('TeamEventMatchSummary', TeamEventMatchSummarySchema);

export default TeamEventMatchSummary;