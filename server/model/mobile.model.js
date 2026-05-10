import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true, 
    },

    modelName: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseRate: {
      type: Number,
      required: true,
    },

    sellingRate: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// prevent duplicate same model under same company
phoneSchema.index({ companyName: 1, modelName: 1 }, { unique: true });

const Phone = mongoose.model("Phone", phoneSchema);
export default Phone;