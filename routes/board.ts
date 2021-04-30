import app from '../app';
import { authChecker } from './../middleware/authChecker';
import { boardController } from '../controller/board';

// 실제 요청 처리하기 전 access token 확인
app.use('/board', authChecker);

// 게시판 글 목록 데이터 보내주기
app.get('/board', boardController.boardAll);

// 게시글 상세 내용 + 댓글 데이터 보내주기
app.get('/board/:board_id', boardController.boardOne);

// 게시글 삭제하기
app.delete('/board/:board_id', boardController.boardDelete);

// 댓글 추가하기
app.post('/board/:board_id/comment', boardController.commentAdd);

// 댓글 삭제하기
app.delete('/board/:board_id/:comment_id', boardController.commentDelete);
