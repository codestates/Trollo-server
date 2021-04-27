import app from '../app'

// 보드정보 다 요청 (목록 만들때 사용)
app.get('/board') // 컨트롤러 추가

// 특정 게시글 정보 요청
app.get('/board/:id') // 컨트롤러 추가

// 게시글 삭제요청
app.delete('/board/:id') // 컨트롤러 추가

// 댓글추가
app.post('/board/comment') // 컨트롤러 추가

// 댓글삭제
app.delete('/board/:id/:commentId') // 컨트롤러 추가