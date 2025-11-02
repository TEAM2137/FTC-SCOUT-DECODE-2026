import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {    
    eventCode: string,
    schedule: [
        {
            description: string,
            tournamentLevel: string,
            series: number,
            matchNUmber: number,
            startTime: string,
            actualStartTime: string,
            postResultTime: string,
            scoreRedFinal: number,
            scoreRedFoul: number,
            scoreRedAuto: number,
            scoreBlueFinal: number,
            scoreBlueFoul: number,
            scoreBlueAuto: number,
            redwins: boolean,
            bluewins: boolean,
            teams: [
                {
                    teamNumber: number,
                    displayTeamNUmber: string,
                    station: string,
                    surrogate: boolean,
                    noShow: boolean,
                    dq: boolean,
                    onField: boolean,
                    teamName: string,
                },
            ]
        },
    ]
}

const ScheduleSchema: Schema<ISchedule> = new Schema({
    eventCode: {
        type: String,
        required: true,
        unique: true
    },
    schedule: [{
        description: {
            type: String,
            required: false,
        },
        tournamentLevel: {
            type: String,
            required: false,
        },
        series: {
            type: Number,
            required: false,
        },
        matchNUmber: {
            type: Number,
            required: false,
        },
        startTime: {
            type: String,
            required: false
        },
        actualStartTime: {
            type: String,
            required: false
        },
        postResultTime: {
            type: String,
            required: false
        },
        scoreRedFinal: {
            type: Number,
            required: false
        },
        scoreRedFoul: {
            type: Number,
            required: false,
        },
        scoreRedAuto: {
            type: Number,
            required: false,
        },
        scoreBlueFinal: {
            type: Number,
            required: false, 
        },
        scoreBlueFoul: {
            type: Number,
            required: false,
        },
        scoreBlueAuto: {
            type: Number,
            required: false,  
        },
        redwins: {
            type: Boolean,
            required: false,
        },
        bluewins: {
            type: Boolean,
            required: false,
        },
        teams: [{
            teamNumber: {
                type: Number,
                required: false,
            },
            displayTeamNUmber: {
                type: String,
                required: false,
            },
            station: {
                type: String,
                required: false,
            },
            surrogate: {
                type: Boolean,
                required: false,
            },
            noShow: {
                type: Boolean,
                required: false 
            },
            dq: {
                type: Boolean,
                required: false,
            },
            onField: {
                type: Boolean,
                required: false  
            },
            teamName: {
                type: String,
                required: false,
            },
        }],
    }],
});


const Schedule = mongoose.models?.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule;    