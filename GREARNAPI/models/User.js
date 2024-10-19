import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
    },
    dob: {
      type: Date,
    },
    activeInvestment: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      default: "+234",
    },
    refreshToken: String,
    avatar: {
      name: {
        type: String,
      },
      fileId: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    balance: {
      walletbalance: {
        type: Number,
        default: 0,
      },
      lockedbalance: {
        type: Number,
        default: 0,
      },
      profitbalance: {
        type: Number,
        default: 0,
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
      },
      accountName: {
        type: String,
      },
      bankName: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
