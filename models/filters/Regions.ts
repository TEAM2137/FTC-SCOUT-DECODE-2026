import mongoose, { Schema, Document } from 'mongoose';

export interface IRegion extends Document {
    regionCode: string,
    regionName: string,
}

const RegionSchema: Schema<IRegion> = new Schema({
    regionCode: {
        type: String,
        required: true,
        unique: true
    },
    regionName: { 
        type: String,
        required: false
    }, 
});


const Region = mongoose.models?.Region || mongoose.model<IRegion>('Region', RegionSchema);

export default Region;