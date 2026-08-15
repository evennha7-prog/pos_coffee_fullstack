import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPurchaseItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IPurchase extends Document {
  user: Types.ObjectId;
  supplier: Types.ObjectId;
  invoiceNumber: string;
  purchaseDate: Date;
  items: IPurchaseItem[];
  totalCost: number;
  paidAmount: number;
  dueAmount: number;
  changeAmount: number;
  paymentStatus: "paid" | "due" | "partial";
  purchaseStatus: "received" | "ordered" | "pending" | "cancel";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPurchase>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "supplier is required"],
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, "invoice number is required"],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: [true, "Purchase date is required"],
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
    purchaseStatus: {
      type: String,
      enum: ["received", "ordered", "pending", "cancel"],
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model<IPurchase>("Purchase", schema);

export default Purchase;
