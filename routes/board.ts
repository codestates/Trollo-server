import { authChecker } from './../middleware/authChecker';
import { boardController } from '../controller/board';
import { commentController } from '../controller/board_comment';
import express from 'express';
const boardRouter = express.Router();

// authChecker - 실제 요청 처리하기 전 access token 확인

// 게시판 글 목록 데이터 보내주기
boardRouter.get('/board', authChecker, boardController.boardAll);

// 게시글 등록하기
boardRouter.post('/board', authChecker, boardController.boardAdd);

// 게시글 상세 내용 + 댓글 데이터 보내주기
boardRouter.get('/board/:board_id', authChecker, boardController.boardOne);

// 게시글 삭제하기
boardRouter.delete('/board/:board_id', authChecker, boardController.boardDelete);

// 댓글 추가하기
boardRouter.post('/board/:board_id/comment', authChecker, commentController.commentAdd);

// 댓글 삭제하기
boardRouter.delete('/board/:board_id/:comment_id', authChecker, commentController.commentDelete);

export default boardRouter;
