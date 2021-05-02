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
	boardOne: async (req: Request, res: Response) => {
		// 게시글 상세 내용 + 댓글 데이터 보내주기
		console.log('💜boardOne ', req.params);
		const board_id = Number(req.params.board_id);
		const boardData = await Boards.findOne({
			where: {
				id: board_id,
			},
		});
		if (boardData === null) {
			res.status(403).json({
				message: 'no board data Error!',
			});
		} else {
			// board_id를 key로 가지는 칸반보드 데이터 불러오기
			// board_id를 key로 가지는 댓글 데이터 불러오기
			res.status(200).json({
				...boardData, // 여기 좀더 고민
				//content
				//comment
			});
		}
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
	boardDelete: async (req: Request, res: Response) => {
		// 게시글 삭제하기
		console.log('💜boardDelete ', req.params);
		const board_id = Number(req.params.board_id);
		await Boards.destroy({
			where: {
				id: board_id,
			},
		});
		// board_id를 key로 가지는 칸반보드 데이터 삭제
		// board_id를 key로 가지는 댓글 데이터 삭제
		res.status(200).json({
			message: `delete ${board_id} complete`,
		});
	},
};

export { boardController };
