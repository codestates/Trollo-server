import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';

const commentController = {
	commentAdd: (req: Request, res: Response) => {
		// 댓글 추가하기
	},
	commentDelete: (req: Request, res: Response) => {
		// 댓글 삭제하기
	},
};

export { commentController };
