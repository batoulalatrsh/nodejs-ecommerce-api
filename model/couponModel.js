const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Coupon name required"],
      unique: [true, "Coupon name must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire date required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Coupon", couponSchema);
