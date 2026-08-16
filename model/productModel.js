const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product name"],
      maxlength: [100, "Too long product name"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      trim: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      max: [100000, "Price can't exceed 100000"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image cover required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // To enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate to get reviews of specific product
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
});

// This part for return URL to client
const setImageUrl = (doc) => {
  // Set image URL
  if (doc.imageCover) {
    const imgUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imgUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/products/${img}`;
      imageList.push(imgUrl);
    });
    doc.images = imageList;
  }
};
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
