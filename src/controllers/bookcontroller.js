const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const reviewModel = require('../models/reviewModel')

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

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      data;

    //validations
    if (!isValid(title)) {
      res
        .status(400)
        .send({ status: false, message: "Book Title is required" });
      return;
    }

    let alreadyUsedTitle = await bookModel.findOne({ title });
    if (alreadyUsedTitle) {
      res
        .status(400)
        .send({ status: false, msg: "Title should be unique" });
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
        message: `${userId} is not a valid user id`,
      });
      return;
    }
    if (!isValid(ISBN)) {
      res.status(400).send({ status: false, message: "Book ISBN is required" });
      return;
    }
    let alreadyUsedISBN = await bookModel.findOne({ ISBN });
    if (alreadyUsedISBN) {
      res.status(400).send({ status: false, msg: "ISBN id should be unique" });
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
    if (!releasedAt) {
      res
        .status(400)
        .send({ status: false, message: "releasedAt is required" });
      return;
    }
    if (!(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/).test(releasedAt)) {
      res
        .status(400)
        .send({ status: false, message: "releasedAt can be a DATE only" });
      return;
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(400).send({ status: false, message: "User does not exit" });
    }
    // Validations end
    const bookData = {
      title,
      excerpt,
      userId: userId,
      ISBN,
      category,
      subcategory,
      releasedAt,
      deletedAt: deletedAt ? new Date() : null
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

//============get books =====================//

const getBooks = async function (req, res) {
  try {
    let { userId, category, subcategory } = req.query
    let filter = {}

    if (Object.keys(req.query).length) {
      if (userId) { filter.userId = userId }
      if (category) { filter.category = category }
      if (subcategory) { filter.subcategory = subcategory }
      //------if user provide any other filter any these---------//
      if (!Object.keys(filter).length) {
        return res.status(404).send({
          status: false,
          msg: "No Book Found!!",
        });
      }
    }

    filter.isDeleted = false
    let allBooks = await bookModel.find({ $and: [filter] }).select({
      title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1
    }).sort({ title: 1 })
    //-----if no book found--------//
    if (!allBooks.length) {
      return res.status(404).send({
        status: false,
        msg: "No Book Found!!",
      });
    }
    res.status(200).send({
      status: true,
      msg: "Books List !!",
      data: allBooks,
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};




//============get book by bookID================//
let getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    //------if bookID is not valid------//
    if (!isvalidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "BookId is not Valid" });
    }
    let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false });
    //----------if no Data found -------//
    if (!isValid(bookData)) {
      return res.status(404).send({
        status: false,
        message: `Book is not found with this ID: ${bookId}`,
      });
    }
//--------getting the data from review Model-----//
    let reviews = await reviewModel
      .find({ bookId: bookId, isDeleted: false })
      .select({
        _id: 1,
        bookId: 1,
        reviewedBy: 1,
        reviewedAt: 1,
        rating: 1,
        review: 1,
      });

    let bookReviews = {
      bookData,
      reviewsData: reviews,
    };

    return res
      .status(200)
      .send({ status: true, message: "Books list", data: bookReviews });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};


module.exports = { createBook, getBooks, getBookById };
