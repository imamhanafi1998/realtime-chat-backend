const mongoose = require('mongoose')
const validator = require('validator')

const userSavedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  {
    timestamps: true,
  }
)

const UserSavedPost = mongoose.model('UserSavedPost', userSavedPostSchema)

module.exports = UserSavedPost
