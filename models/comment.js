const mongoose = require('mongoose')
const validator = require('validator')
const Report = require('./report')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    read: {
    	type: Boolean,
      	default: false
    }
  },
  {
    timestamps: true,
  }
)

commentSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'commentId',
})

commentSchema.pre('remove', async function(next) {
	const comment = this
	await Report.deleteMany({ commentId: comment._id })
	next()
})

// const Post = mongoose.model('Post', postSchema)
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
