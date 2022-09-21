const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const  mongoose = require("mongoose");

const isvalidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isvalidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//==============================create book====================================//


const createBook = async (req, res) => {
  try {
    const data = req.body;
    if (!isvalidRequestBody(data)) {
      res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide book details",
      });
      return;
    }
  
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, deletedAt } =
      data;


    //validations
    if (!isValid(title)) {
      res
        .status(400)
        .send({ status: false, message: "Book Title is required" });
      return;
    }
    if (!isValid(excerpt)) {
      res
        .status(400)
        .send({ status: false, message: "Book excerpt is required" });
      return;
    }
    if (!isValid(userId)) {
      res.status(400).send({ status: false, message: "User id is required" });
      return;
    }
    if (!isvalidObjectId(userId)) {
      res.status(400).send({
        status: false,
        message: `${userId}is not a valid user id`,
      });
      return;
    }
    if (!isValid(ISBN)) {
      res.status(400).send({ status: false, message: "Book ISBN is required" });
      return;
    }
    if (!isValid(category)) {
      res
        .status(400)
        .send({ status: false, message: "Book Category is required" });
      return;
    }

    if (!isValid(subcategory)) {
      res
        .status(400)
        .send({ status: false, message: "Book subcategory is required" });
      return;
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(400).send({ status: false, message: " User does not exit " });
    }
    // Validations end
    const bookData = {
      title,
      excerpt,
      userId: userId,
      ISBN,
      category,
      subcategory,
      releasedAt: releasedAt ? new Date() : null,
      deletedAt: deletedAt ? new Date() :null
    };
    const newBookCreated = await bookModel.create(bookData);
    res.status(201).send({
      status: true,
      message: "Book created successfully",
      data: newBookCreated,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createBook = createBook;
