import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';
import { Users } from '../src/db/models/user';

const boardController = {
	boardAll: async (req: Request, res: Response) => {
		// 게시판 글 목록 데이터 보내주기
		console.log('💜boardAll');
		let boardList = await Boards.findAll();
		res.status(200).json({
			boardList,
		});
	},
	boardOne: (req: Request, res: Response) => {
		// 게시글 상세 내용 + 댓글 데이터 보내주기
	},
	boardAdd: (req: Request, res: Response) => {
		// 게시글 등록하기
	},
	boardDelete: (req: Request, res: Response) => {
		// 게시글 삭제하기
	},
};

export { boardController };
