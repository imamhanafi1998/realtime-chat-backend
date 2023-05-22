const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const Report = require('../models/report')
const auth = require('../middleware/auth')
const router = new express.Router()
const mongoose = require('mongoose')
const axios = require('axios')

router.get('/reports/comments/:page', auth, async (req, res) => {	
	const getCommentReports = async () => {
		if (!req.user.admin) {
			res.status(401).send({message: "admin only"})
			return
		}
		const limit = 8
		const page = parseInt(req.params.page) - 1
		const skip = page * limit
		try {
			const commentsCount = await Report.find({commentId: {$exists: true}}).countDocuments()
    		const comments = await Report.aggregate([
    			{ $match: {"commentId": { $ne: null }} },
				{
      				$lookup: {
         				from: "comments",
         				localField: "commentId",
         				foreignField: "_id",
         				as: "commentDetails"
      				}
   				},
   				{
            		$unwind:'$commentDetails'
        		},
   				{
      				$lookup: {
         				from: "posts",
         				localField: "commentDetails.postId",
         				foreignField: "_id",
         				as: "postDetails"
      				}
   				},
   				{
            		$unwind:'$postDetails'
        		},
        		{
      				$lookup: {
         				from: "users",
         				localField: "commentDetails.ownerId",
         				foreignField: "_id",
         				as: "userDetails"
      				}
   				},
   				{
            		$unwind:'$userDetails'
        		},
        		{
      				$lookup: {
         				from: "users",
         				localField: "ownerId",
         				foreignField: "_id",
         				as: "reporterDetails"
      				}
   				},
   				{
            		$unwind:'$reporterDetails'
        		},
        		{
            		$project: {
                		"commentDetails._id": 0,
                		"commentDetails.read": 0,
                		"commentDetails.updatedAt": 0,
                		"commentDetails.createdAt": 0,
                		"postDetails._id": 0,
                		"postDetails.ownerId": 0,
                		"postDetails.desc": 0,
                		"postDetails.tags": 0,
                		"postDetails.createdAt": 0,
                		"postDetails.updatedAt": 0,
                		"userDetails._id": 0,
                		"userDetails.activationToken": 0,
                		"userDetails.email": 0,
                		"userDetails.password": 0,
                		"userDetails.tokens": 0,
                		"userDetails.admin": 0,
                		"userDetails.banned": 0,
                		"userDetails.updatedAt": 0,
                		"userDetails.createdAt": 0,
                		"reporterDetails._id": 0,
                		"reporterDetails.activationToken": 0,
                		"reporterDetails.email": 0,
                		"reporterDetails.password": 0,
                		"reporterDetails.tokens": 0,
                		"reporterDetails.admin": 0,
                		"reporterDetails.banned": 0,
                		"reporterDetails.updatedAt": 0,
                		"reporterDetails.createdAt": 0,
            		}
        		},
        		{
        			"$sort": {"commentDetails.comment": 1, "createdAt": -1}
        		}
			]).skip(skip).limit(limit)
    		res.status(200).send({commentsReports: comments, commentsReportsCount: commentsCount})
		} catch (e) {
			res.status(500).send({message: "unknown error"})
		}
	}
	getCommentReports()
})

router.get('/reports/posts/:page', auth, async (req, res) => {
	const getPostReports = async () => {
		if (!req.user.admin) {
			res.status(401).send({message: "admin only"})
			return
		}
		const limit = 8
		const page = parseInt(req.params.page) - 1
		const skip = page * limit
		try {
			const postsCount = await Report.find({postId: {$exists: true}}).countDocuments()
    		const posts = await Report.aggregate([
    			{ $match: {"postId": { $ne: null }} },
				{
      				$lookup: {
         				from: "posts",
         				localField: "postId",
         				foreignField: "_id",
         				as: "postDetails"
      				}
   				},
   				{
            		$unwind:'$postDetails'
        		},
        		{
      				$lookup: {
         				from: "users",
         				localField: "postDetails.ownerId",
         				foreignField: "_id",
         				as: "userDetails"
      				}
   				},
   				{
            		$unwind:'$userDetails'
        		},
        		{
      				$lookup: {
         				from: "users",
         				localField: "ownerId",
         				foreignField: "_id",
         				as: "reporterDetails"
      				}
   				},
   				{
            		$unwind:'$reporterDetails'
        		},
        		{
            		$project: {
                		"postDetails._id": 0,
                		"postDetails.ownerId": 0,
                		"postDetails.tags": 0,
                		"postDetails.createdAt": 0,
                		"postDetails.updatedAt": 0,
                		"userDetails.activationToken": 0,
                		"userDetails.email": 0,
                		"userDetails.password": 0,
                		"userDetails.tokens": 0,
                		"userDetails.admin": 0,
                		"userDetails.banned": 0,
                		"userDetails.updatedAt": 0,
                		"userDetails.createdAt": 0,
                		"reporterDetails._id": 0,
                		"reporterDetails.activationToken": 0,
                		"reporterDetails.email": 0,
                		"reporterDetails.password": 0,
                		"reporterDetails.tokens": 0,
                		"reporterDetails.admin": 0,
                		"reporterDetails.banned": 0,
                		"reporterDetails.updatedAt": 0,
                		"reporterDetails.createdAt": 0,
            		}
        		},
        		{
        			"$sort": {"postDetails.title": 1, "createdAt": -1}
        		}
			]).skip(skip).limit(limit)
    		res.status(200).send({postsReports: posts, postsReportsCount: postsCount})
		} catch (e) {
			res.status(500).send({message: "unknown error"})
		}
	}
	getPostReports()
})

router.get('/reports/users/:page', auth, async (req, res) => {	
	const getUserReports = async () => {
		if (!req.user.admin) {
			res.status(401).send({message: "admin only"})
			return
		}
		const limit = 8
		const page = parseInt(req.params.page) - 1
		const skip = page * limit
		try {
			const usersCount = await Report.find({userId: {$exists: true}}).countDocuments()
    		const users = await Report.aggregate([
    			{ $match: {"userId": { $ne: null }} },
        		{
      				$lookup: {
         				from: "users",
         				localField: "userId",
         				foreignField: "_id",
         				as: "userDetails"
      				}
   				},
   				{
            		$unwind:'$userDetails'
        		},
        		{
      				$lookup: {
         				from: "users",
         				localField: "ownerId",
         				foreignField: "_id",
         				as: "reporterDetails"
      				}
   				},
   				{
            		$unwind:'$reporterDetails'
        		},
        		{
            		$project: {
                		"userDetails._id": 0,
                		"userDetails.activationToken": 0,
                		"userDetails.email": 0,
                		"userDetails.password": 0,
                		"userDetails.tokens": 0,
                		"userDetails.updatedAt": 0,
                		"userDetails.createdAt": 0,
                		"reporterDetails._id": 0,
                		"reporterDetails.activationToken": 0,
                		"reporterDetails.email": 0,
                		"reporterDetails.password": 0,
                		"reporterDetails.tokens": 0,
                		"reporterDetails.admin": 0,
                		"reporterDetails.banned": 0,
                		"reporterDetails.updatedAt": 0,
                		"reporterDetails.createdAt": 0,
            		}
        		},
        		{
        			"$sort": {"userDetails.fullname": 1, "createdAt": -1}
        		}
			]).skip(skip).limit(limit)
    		res.status(200).send({usersReports: users, usersReportsCount: usersCount})
		} catch (e) {
			res.status(500).send({message: "unknown error"})
		}
	}
	getUserReports()
})

router.post('/report', auth, async (req, res) => {
	const saveReport = async () => {
		try {
			let report = new Report({
				ownerId: mongoose.Types.ObjectId(req.user._id),
				desc: req.body.desc,
  			})
			if (req.body.userId) {
				report.postId = undefined
				report.commentId = undefined
				const targetUser = await User.findById(req.body.userId)
				if (targetUser.banned) {
					res.send(400).send({message: "cant report on banned already account"})
					return
				} else {
					report.userId = mongoose.Types.ObjectId(req.body.userId)
				}
			} else if (req.body.postId) {
				report.userId = undefined
				report.commentId = undefined
				report.postId = mongoose.Types.ObjectId(req.body.postId)
			} else if (req.body.commentId) {
				report.userId = undefined
				report.postId = undefined
				report.commentId = mongoose.Types.ObjectId(req.body.commentId)
			} else {
				res.status(401).send({message: "bad request"})
				return
			}
    			await report.save()
    			res.status(201).send({report, message: "laporan berhasil dibuat"})
		} catch(e) {
			res.status(500).send(e)
		}
	}
	saveReport()
})

router.get('/reports', auth, async (req, res) => {
	if (!req.user.admin) {
		res.status(401).send({message: "admin only"})
		return
	}
	try {
		const reports = await Report.find({})
		res.status(200).send({reports})
	} catch(e) {
		res.status(500).send(e)
	}
})

router.delete('/rep', async (req, res) => {
	try {
		await Report.deleteMany({commentId: {$exists: true}})
		//await reports.remove()
		res.status(200).send({m: "s"})
	} catch(e) {
		res.status(500).send(e)
	}
})

module.exports = router
