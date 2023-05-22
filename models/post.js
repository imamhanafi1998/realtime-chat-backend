const mongoose = require('mongoose')
const validator = require('validator')
const Comment = require('./comment')
const Report = require('./report')
const UserSavedPost = require('./userSavedPost')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        tag: {
          type: String,
          required: true,
          maxlength: 10
        },
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
})

postSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'postId',
})

postSchema.virtual('userSavedPosts', {
  ref: 'UserSavedPost',
  localField: '_id',
  foreignField: 'postId',
})

postSchema.pre('remove', async function(next) {
	const post = this
	await Comment.deleteMany({ postId: post._id })
	next()
})

postSchema.pre('remove', async function(next) {
	const post = this
	await Report.deleteMany({ postId: post._id })
	next()
})

postSchema.pre('remove', async function(next) {
	const post = this
	await UserSavedPost.deleteMany({ postId: post._id })
	next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
