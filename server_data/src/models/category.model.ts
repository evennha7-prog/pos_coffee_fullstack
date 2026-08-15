import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "name is required"],
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", schema);

export default Category;
