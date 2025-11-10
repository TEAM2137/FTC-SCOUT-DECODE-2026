import mongoose, { Schema, Document } from 'mongoose';


export interface IAward extends Document
    {
      awardId: number,
      sortId: number,
      teamId: number,
      teamProfileId: number,
      eventId: number,
      eventDivisionId: number,
      eventCode: string,
      name: string,
      series: number,
      teamNumber: number,
      teamName: string,
      schoolName: string,
      fullTeamName: string,
      person: string,
    }

const AwardSchema: Schema = new Schema({
    awardId: { type: Number, required: true },
    sortId: { type: Number, required: true },
    teamId: { type: Number, required: true },
    teamProfileId: { type: Number, required: true },
    eventId: { type: Number, required: true },
    eventDivisionId: { type: Number, required: true },
    eventCode: { type: String, required: true },
    name: { type: String, required: true },
    series: { type: Number, required: true },
    teamNumber: { type: Number, required: true },
    teamName: { type: String, required: true },
    schoolName: { type: String, required: true },
    fullTeamName: { type: String, required: true },
    person: { type: String, required: true },
});


const Award = mongoose.models?.Award || mongoose.model<IAward>('Award', AwardSchema);

export default Award;