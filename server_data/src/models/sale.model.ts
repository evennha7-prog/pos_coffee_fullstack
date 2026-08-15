import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISaleItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISale extends Document {
  user: Types.ObjectId;
  customer?: Types.ObjectId;
  invoiceNumber: string;
  items: ISaleItem[];
  totalCost: number;
  paidAmount: number;
  dueAmount: number;
  changeAmount: number;
  paymentStatus: "paid" | "due" | "partial";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISale>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, "invoice number is required"],
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalCost: {
      type: Number,
      min: [0, "total cost can't be negative"],
      required: [true, "total cost is required"],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount can't be negative"],
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: [0, "Due amount can't be negative"],
    },
    changeAmount: {
      type: Number,
      default: 0,
      min: [0, "Change amount can't be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "due", "partial"],
      required: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model<ISale>("Sale", schema);

export default Sale;
