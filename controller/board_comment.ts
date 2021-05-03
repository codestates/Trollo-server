import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';
import mongoose from 'mongoose';
import commentModel from '../src/db/models/comment';

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
		const { comment_body } = req.body;

		const comment = new commentModel({
			board_id,
			user_id,
			user_email,
			comment_body,
		});
		// new mongoose.Types.ObjectId 유니크값 생성기 같은 느낌이다. 아이디생성용
		return comment
			.save()
			.then(async result => {
				console.log(result);
				const foundData = await commentModel.find({ board_id });
				return res.status(201).json({ commentAll: foundData });
			})
			.catch(error => {
				return res.status(500).json({
					message: error.message,
					error,
				});
			});
	},
	commentDelete: (req: Request, res: Response) => {
		// 댓글 삭제하기
	},
};

export { commentController };
