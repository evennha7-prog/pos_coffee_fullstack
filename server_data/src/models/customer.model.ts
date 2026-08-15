import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      unique: true,
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

const Customer = mongoose.model<ICustomer>("Customer", schema);

export default Customer;
