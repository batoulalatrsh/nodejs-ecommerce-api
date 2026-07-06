const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = express();

app.get("/", (req, res) => {
  res.send("Hello here my ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
