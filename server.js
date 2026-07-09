const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });

// Connect with DB
mongoose
  .connect(process.env.DB_URL)
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.error(`Database Error: ${err}`);
    process.exit(1);
  });

const app = express();

// I want activate morgan in development mode
app.use(express.json());
if (process.env.MODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.MODE_ENV}`);
}

// 1- Creatte Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);

app.post("/", (req, res, next) => {
  const name = req.body.name;
  console.log(name);

  const newCategory = new CategoryModel({ name });
  newCategory
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/", (req, res) => {
  res.send("Hello here my ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
