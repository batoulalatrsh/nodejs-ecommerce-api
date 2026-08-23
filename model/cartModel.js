const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Cart item must belong to a product"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity can't be less than 1"],
        },
        color: String,
        price: {
          type: Number,
          required: [true, "Cart item must have a price"],
          min: [0, "Price can't be negative"],
        },
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
