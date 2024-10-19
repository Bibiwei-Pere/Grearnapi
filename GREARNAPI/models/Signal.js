import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const stateSchema = new mongoose.Schema({
  state: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const signalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    data: {
      type: [stateSchema],
      default: [],
    },
    orderType: {
      type: String,
      default: "BUY",
    },

    info: {
      type: String,
    },
    duration: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Archived",
    },
  },

  {
    timestamps: true,
  }
);

export default model("Signal", signalSchema);
