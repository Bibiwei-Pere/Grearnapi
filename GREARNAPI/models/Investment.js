import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: String,
      required: true,
    },
    image: {
      name: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    geo_location: {
      type: String,
      default: "",
    },
    minimum_invest: {
      type: Number,
      required: true,
    },
    roi: {
      type: Number,
      default: 4,
    },
    duration: {
      type: Number,
      default: 0,
    },
    info: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    gain: {
      type: Number,
      default: 50,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Investment", investmentSchema);
