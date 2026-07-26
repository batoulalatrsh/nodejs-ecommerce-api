const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.deleteOne({ _id: id });

    if (!document) {
      return next(
        new AppError(`No document for this id: ${req.params.id}`, 404),
      );
    }
    res.status(204).json();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
    );
    if (!document) {
      return next(
        new AppError(`No document for this id: ${req.params.id}`, 404),
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new AppError(`No document for this id: ${req.params.id}`, 404),
      );
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sorting();

    const { mongooseQuery, pagination } = apiFeatures;
    // Execute the query
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, page: pagination, data: documents });
  });
