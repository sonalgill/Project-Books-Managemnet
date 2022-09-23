const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");

//first Checking Book (Present?/Not) || (Deleted?/Not)
module.exports = {
  reviews: async function (req, res) {
    try {
      let checkBook = await bookModel.findOne({ _id: req.params.bookId });
      if (checkBook == null) {
        return res.status(404).send({ status: false, msg: "book-Not Found !!" });
      }
      //Checking Book (Deleted?/Not)
      if (checkBook.isDeleted == true) {
        return res
          .status(400)
          .send({ status: false, msg: "This Book is Deleted" });
      }
      //adding reviewsData Or We Can Say That adding reviewsData Section in Books

      let reviewsData = await reviewModel.create(req.body)
      let addReview = await bookModel.findByIdAndUpdate(req.params.bookId, { $inc: { reviews: 1 } })
      let obj = {
        _id: checkBook._id,
        title: checkBook.title,
        excerpt: checkBook.excerpt,
        userId: checkBook.userId,
        ISBN: checkBook.ISBN,
        category: checkBook.category,
        subcategory: checkBook.subcategory,
        reviews: checkBook.reviews,
        deletedAt: checkBook.deletedAt,
        isDeleted: checkBook.isDeleted,
        releasedAt: checkBook.releasedAt,
        reviewsData: reviewsData
      }
      return res.status(201).send({ status: true, msg: "Review created Successfully", data: obj });
    } catch (err) {
      return res.send({
        status: false,
        msg: "Server Error",
        errMessage: err.message,
      });
    }
  },


  deleteReview: async (req, res) => {
    try {
      let reviewID = req.params.reviewId
      let bookID = req.params.bookId
      let reviewsData = await reviewModel.findOne({
        bookId: bookID,
        _id: reviewID,
        isDeleted: false,
      });
      if (!reviewsData) {
        return res.status(404).send({
          status: false,
          message: " review not found"
        });
      }

      let deletedData = await reviewModel.findOneAndUpdate(
        { _id: reviewID },
        { $set: { isDeleted: true } },
        { new: true }
      );
      let decReviewData = await bookModel.findByIdAndUpdate(bookID, { $inc: { reviews: -1 } })
      res.status(200).send({
        status: true,
        message: "review deleted successfully ", data: deletedData
      })

    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }
}
