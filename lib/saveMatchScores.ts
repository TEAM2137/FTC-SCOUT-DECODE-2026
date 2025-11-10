'use server'

import MatchScore from "@/models/decode/MatchScore"
import connectDB from "@/lib/db";


export async function saveMatchScore(matchScoreData: { 
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
    })

    {
    console.log(matchScoreData)
    try {
        await connectDB();
        await MatchScore.findOneAndUpdate( { scoutID: matchScoreData.scoutID }, matchScoreData, { upsert: true, });
        console.log('Saved Match Score');
        return (true);
    } catch (error) {
        console.log(error);
        return (false);
    }
}