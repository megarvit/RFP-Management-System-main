import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const RFPSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    specification: {
      type: String,
      required: true,
    },

    items: {
      type: [ItemSchema], // array of items
      default: [],
    },

    warranty: {
      type: String,
      default: null,
    },

    paymentTerms: {
      type: String,
      default: null,
    },

    budget: {
      type: Number,
      default: 0,
    },

    delivery: {
      type: String,
      default: null,
    },

    created_by: {
      type: Number,
      required: true,
    },

    assignedVendor: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RFP", RFPSchema);
