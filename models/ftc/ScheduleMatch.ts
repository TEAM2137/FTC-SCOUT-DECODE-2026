import mongoose, { Schema, Document } from 'mongoose';


export interface IScheduleMatch extends Document
{
    eventCode: string,
    matchLevel: string,
    matchNumber: number,
    matchSeries: number,
    description: string,
    startTime: string,
    actualStartTime: string,
    postResultTime: string,
    scoreRedFinal: number,
    scoreRedFoul: number,
    scoreRedAuto: number,
    scoreBlueFinal: number,
    scoreBlueFoul: number,
    scoreBlueAuto: number,
    redWins: boolean,
    blueWins: boolean,
    randomization: number,
    played: boolean,
    teams: [
       {
        teamNumber: number,
        station: string,
        surrogate: boolean,
        noShow: boolean,
        dq: boolean,
        onField: boolean,
        teamName: string,
        autoLeave: boolean,
        teleBase: string
      }
    ]
  }

  const ScheduleMatchSchema: Schema = new Schema({
    eventCode: { type: String, required: true },
    matchLevel: { type: String, required: true },
    matchNumber: { type: Number, required: true },
    matchSeries: { type: Number, required: true },
    description: { type: String, required: true },
    startTime: { type: String, required: true },
    actualStartTime: { type: String, required: true },
    postResultTime: { type: String, required: true },
    scoreRedFinal: { type: Number, required: true },
    scoreRedFoul: { type: Number, required: true },
    scoreRedAuto: { type: Number, required: true },
    scoreBlueFinal: { type: Number, required: true },
    scoreBlueFoul: { type: Number, required: true },
    scoreBlueAuto: { type: Number, required: true },
    redWins: { type: Boolean, required: true },
    blueWins: { type: Boolean, required: true },
    randomization: { type: Number, required: true },
    played: { type: Boolean, required: true },
    teams: [
        {
            teamNumber: { type: Number, required: false },
            station: { type: String, required: false },
            surrogate: { type: Boolean, required: false },
            noShow: { type: Boolean, required: false },
            dq: { type: Boolean, required: false },
            onField: { type: Boolean, required: false },
            teamName: { type: String, required: false },
            autoLeave: { type: Boolean, required: false },
            teleBase: { type: String, required: false },
        },
    ],
});

const ScheduleMatch = mongoose.models?.ScheduleMatch || mongoose.model<IScheduleMatch>('ScheduleMatch', ScheduleMatchSchema);

export default ScheduleMatch;