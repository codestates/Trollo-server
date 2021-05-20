import { Request, Response } from 'express';
import mongoose from 'mongoose';
import commentModel from '../src/db/models/comment';
import { commentDisplay } from './commentDisplay';

interface Comment extends mongoose.Document {
	user_id: string;
	user_email: string;
	comment_body: string;
	board_id: number;
}

const commentController = {
	commentAdd: (req: Request, res: Response) => {
		// 댓글 추가하기
		console.log('💚commentAdd - ', req.params, req.body);
		const user_id = req.userId;
		const user_email = req.userEmail;
		const board_id = Number(req.params.board_id);
		const { comment_body, parent_id } = req.body;
		const comment = new commentModel({
			board_id,
			user_id,
			user_email,
			comment_body,
			parent_id,
		});
		return comment
			.save()
			.then(async result => {
				const commentData = await commentModel.find({ board_id });
				const commentAll = commentDisplay(commentData);
				return res.status(201).json({
					commentAll,
				});
			})
			.catch(err => {
				console.log('💚commentAdd - ERROR// ', err.message);
				return res.status(500).json({
					message: 'comment Error ' + err.message,
				});
			});
	},
	commentDelete: async (req: Request, res: Response) => {
		// 댓글 삭제하기
		console.log('💚commentDelete - ', req.params);
		const board_id = Number(req.params.board_id);
		const comment_id = String(req.params.comment_id);
		const user_id = req.userId;
		commentModel
			.deleteOne()
			.and([{ _id: comment_id }, { user_id }])
			.then(async data => {
				const commentData = await commentModel.find({ board_id });
				const commentAll = commentDisplay(commentData);
				res.status(200).json({
					commentAll,
				});
			})
			.catch(err => {
				console.log('💚commentDelete - ERROR// ', err.message);
				return res.status(500).json({
					message: 'comment Error ' + err.message,
				});
			});
	},
};

export { commentController };
