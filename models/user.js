const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')
const Post = require('./post')
const Comment = require('./comment')
const Report = require('./report')
const UserSavedPost = require('./userSavedPost')

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: [ validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    activationToken: {
      type: String,
      trim: true,
      default: randtoken.generate(16)
    },
    admin: {
      type: Boolean,
      default: false,
      set(value) {
      	return false
      }
    },
    banned: {
      type: Boolean,
      default: false
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'imam_bahagia')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Pengguna tidak ditemukan')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Password salah')
  }
  return user
}

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'ownerId',
})

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'ownerId',
})

userSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'ownerId',
})

userSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'userId',
})

userSchema.virtual('userSavedPosts', {
	ref: 'UserSavedPost',
	localField: '_id',
	foreignField: 'userId',
})

// userSchema.pre('remove', async function(next) {
//   const user = this
//   await Task.deleteMany({ owner: user._id })
//   next()
// })

const User = mongoose.model('User', userSchema)

userSchema.plugin(uniqueValidator)

module.exports = User
