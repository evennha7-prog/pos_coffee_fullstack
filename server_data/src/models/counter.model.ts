import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
  _id: string;
  sequcene_value: number;
}

const schema = new Schema<ICounter>({
  _id: { type: String, required: true },
  sequcene_value: { type: Number, default: 0 },
});

const Counter = mongoose.model<ICounter>("Counter", schema);

export default Counter;
