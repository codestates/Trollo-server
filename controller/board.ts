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
	boardAdd: async (req: Request, res: Response) => {
		// 게시글 등록하기
		console.log('💜boardAdd ', req.body, req.user_email, req.user_id);
		const title = req.body.title;
		if (title !== '') {
			const writer = req.user_email;
			const user_id = req.user_id;
			const newBoard = await Boards.create({
				title,
				writer,
				user_id,
			});
			const board_id = newBoard.id;
			// board_id를 key로 가지는 칸반보드 데이터 저장
			// board_id를 key로 가지는 댓글 데이터 저장(빈파일? 생성)
			res.status(200).json({
				board_id,
			});
		} else {
			res.status(400).json({
				message: 'no input title Error!',
			});
		}
	},
	boardDelete: (req: Request, res: Response) => {
		// 게시글 삭제하기
	},
};

export { boardController };
