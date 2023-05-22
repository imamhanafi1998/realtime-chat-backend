const mongoose = require('mongoose')
const validator = require('validator')

const reportSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }
  },
  {
    timestamps: true,
  }
)

const Report = mongoose.model('Report', reportSchema)

module.exports = Report
