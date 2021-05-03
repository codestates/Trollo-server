import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';
import mongoose from 'mongoose';
import commentModel from '../src/db/models/comment';
import { commentDisplay } from './commentDisplay';
// interface
interface Comment extends mongoose.Document {
	user_id: string;
	user_email: string;
	comment_body: string;
	// children: Array<Comment>;
	board_id: number;
}
const commentController = {
	commentAdd: (req: Request, res: Response) => {
		// 댓글 추가하기
		console.log(req.body);
		console.log('💜commentAdd ', req.params);
		const user_id = req.user_id;
		const user_email = req.user_email;
		const board_id = Number(req.params.board_id);
		const { comment_body, parent_id } = req.body;
		const comment = new commentModel({
			board_id,
			user_id,
			user_email,
			comment_body,
			parent_id,
		});
		// new mongoose.Types.ObjectId 유니크값 생성기 같은 느낌이다. 아이디생성용
		return comment
			.save()
			.then(async result => {
				//console.log(result);
				const commentData = await commentModel.find({ board_id });
				console.log('🤎', commentData);
				const commentAll = commentDisplay(commentData);
				return res.status(201).json({
					commentAll,
					//commentData,
				});
			})
			.catch(error => {
				return res.status(500).json({
					message: error.message,
				});
			});
	},
	commentDelete: async (req: Request, res: Response) => {
		// 댓글 삭제하기
		console.log('💜commentDelete ', req.params);
		const board_id = Number(req.params.board_id);
		const comment_id = String(req.params.comment_id);
		const user_id = req.user_id;
		const user_email = req.user_email;
		console.log(user_id);
		commentModel
			.deleteOne()
			.and([{ _id: comment_id }, { user_id }])
			.then(async data => {
				const commentAll = await commentModel.find({ board_id });
				res.status(200).json({
					commentAll,
				});
			})
			.catch(err => {
				res.status(500).json({
					message: err.message,
				});
			});
	},
};

export { commentController };
