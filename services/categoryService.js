const CategoryModel = require("../model/categoryModel");

const getCategories = (req, res, next) => {
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
};
module.exports = {
  getCategories,
};
