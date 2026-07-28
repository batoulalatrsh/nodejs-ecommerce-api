const mongoose = require("mongoose");

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: true,
      minlength: [2, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const setImageUrl = (doc) => {
  // Set image URL
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imgUrl;
  }
};
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create model
module.exports = mongoose.model("Brand", brandSchema);
