import mongoose, { Schema, Document } from 'mongoose';

export interface IScore extends Document 
{
    scoreID: string,
    eventCode: string,
    tournamentLevel: string,
    matchScores: [
        {
            matchLevel: string,
            matchSeries: number,
            matchNumber: number,
            randomization: number,
            alliances: [
                {
                    alliance: string,
                    team: number,
                    autoClassifiedArtifacts: number,
                    autoOverflowArtifacts: number,
                    autoClassifierState: string[],
                    robot1Auto: boolean,
                    robot2Auto: boolean,
                    autoLeavePoints: number,
                    autoArtifactPoints: number,
                    autoPatternPoints: number,
                    teleopClassifiedArtifacts: number,
                    teleopOverflowArtifacts: number,
                    teleopDepotArtifacts: number,
                    teleopClassifierState: string[],
                    robot1Teleop: string,
                    robot2Teleop: string,
                    teleopArtifactPoints: number,
                    teleopDepotPoints: number,
                    teleopPatternPoints: number,
                    teleopBasePoints: number,
                    autoPoints: number,
                    teleopPoints: number,
                    foulPointsCommitted: number,
                    preFoulTotal: number,
                    movementRP: boolean,
                    goalRP: boolean,
                    patternRP: boolean,
                    totalPoints: number,
                    majorFouls: number,
                    minorFouls: number,
                },
            ]
        }
    ]
}

const ScoreSchema: Schema<IScore> = new Schema({
    scoreID: {
        type: String,
        required: true,
        unique: true
    },
    eventCode: {
        type: String,
        required: true,
    },
    tournamentLevel: {
        type: String,
        required: true,
    },
    matchScores: [{
        matchLevel: {
            type: String,
            required: false,
        },
        matchSeries: {
            type: Number,
            required: false,
        },
        matchNumber: {  
            type: Number,   
            required: false, 
        }, 
        randomization: {    
            type: Number,
            required: false,
        },
        alliances: [{
            alliance: {
                type: String,
                required: false,
            },
            team: {
                type: Number,
                required: false,
            },
            autoClassifiedArtifacts: {
                type: Number,
                required: false,
            },
            autoOverflowArtifacts: {
                type: Number,
                required: false,
            }, 
            autoClassifierState: [{
                type: String,
                required: false,
            },],
            robot1Auto: {
                type: Boolean,
                required: false,
            }, 
            robot2Auto: {
                type: Boolean,
                required: false,
            },
            autoLeavePoints: {
                type: Number,
                required: false,
            },
            autoArtifactPoints: {
                type: Number,
                required: false,
            },
            autoPatternPoints: {
                type: Number,
                required: false,
            },
            teleopClassifiedArtifacts: {
                type: Number,
                required: false,
            },
            teleopOverflowArtifacts: {
                type: Number,
                required: false, 
            },
            teleopDepotArtifacts: {
                type: Number,
                required: false, 
            },
            teleopClassifierState: [{
                type: String,
                required: false,
            },],
            robot1Teleop: {
                type: String,
                required: false,
            },
            robot2Teleop: {
                type: String,
                required: false,
            },
            teleopArtifactPoints: {
                type: Number,
                required: false,
            },
            teleopDepotPoints: {
                type: Number,
                required: false,
            }, 
            teleopPatternPoints: {
                type: Number,
                required: false,
            },
            totalPoints: {
                type: Number,
               
                required: false
            },
            majorFouls: {
                type: Number,
                required: false,
            },
            minorFouls: {
                type: Number,
                required: false,
            }
            
        }],
    }],
})

const Score = mongoose.models?.Score || mongoose.model<IScore>('Score', ScoreSchema);
export default Score;