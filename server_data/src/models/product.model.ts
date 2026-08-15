import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: Types.ObjectId;
  code: string;
  imageUrl: string;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "category is required"],
      ref: "Category",
    },
    code: {
      type: String,
      unique: true,
      required: [true, "Code product is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is required"],
    },
    currentStock: {
      type: Number,
      min: [0, "Current stock must be greater than or equal zero"],
      default: 0,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", schema);

export default Product;
