import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';

const boardController = {
	boardAll: (req: Request, res: Response) => {
		// 게시판 글 목록 데이터 보내주기
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
	commentAdd: (req: Request, res: Response) => {
		// 댓글 추가하기
	},
	commentDelete: (req: Request, res: Response) => {
		// 댓글 삭제하기
	},
};

export { boardController };
