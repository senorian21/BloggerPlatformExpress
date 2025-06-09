import mongoose from "mongoose";

export type rate = {
    IP: string;
    URL: string;
    date: Date;
};


const rateSchema = new mongoose.Schema<rate>({
    IP: {
        type: String,
        required: true,
    },
    URL: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});


export const RateModel = mongoose.model("RATE", rateSchema);