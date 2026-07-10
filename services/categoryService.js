const CategoryModel = require("../model/categoryModel");
var slugify = require("slugify");

const getCategories = (req, res, next) => {
  //   const name = req.body.name
  //   console.log(name);
  res.json();
};
const createCategory = async (req, res, next) => {
  const name = req.body.name;

  
  const category = await CategoryModel.create({
    name,
    slug: slugify(name),
  });

  if (!category) {
    return res.status(400).send(err);
  }

  res.status(201).json({ data: category });
};
module.exports = {
  getCategories,
  createCategory,
};
