const mongoose = require("mongoose");

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: true,
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
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

// This part for return URL to client
const setImageUrl = (doc) => {
  // Set image URL
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
};
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
