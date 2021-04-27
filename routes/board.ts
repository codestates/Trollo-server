import app from '../app'
import { boardController } from '../controller/board';

// 게시판 글 목록 데이터 보내주기
app.get('/board', boardController.boardAll);

// 게시글 상세 내용 + 댓글 데이터 보내주기
app.get('/board/:id', boardController.boardOne);

// 게시글 삭제하기
app.delete('/board/:id', boardController.boardDelete);

// 댓글 추가하기
app.post('/board/comment', boardController.commentAdd);

// 댓글 삭제하기
app.delete('/board/:id/:commentId', boardController.commentDelete);