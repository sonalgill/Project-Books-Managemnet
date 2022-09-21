const mongoose = require('mongoose')
const reviewModel = new mongoose.Schema(
    {
        bookId: {
            type: ObjectId,
            required: true,
            ref: 'book'
        },
        reviewedBy: {
            type: String,
            required: true,
            default: 'Guest'
        },
        reviewedAt: {
            type: Date,
            required: true
        },
        rating: {
            type: Number,
            value: /^[1-5]$/,
            required: true
        },
        review: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    }
)

module.exports = mongoose.model('review', reviewModel)