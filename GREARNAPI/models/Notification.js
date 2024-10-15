import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    product: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

// give numbers to each ticket starting from 500
notificationSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 1,
});

export default model("Notification", notificationSchema);
