import mongoose, { Document, Schema } from "mongoose";

export interface ISupplier extends Document {
  businessName: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISupplier>(
  {
    businessName: {
      type: String,
      unique: true,
      required: [true, "name is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model<ISupplier>("Supplier", schema);

export default Supplier;
