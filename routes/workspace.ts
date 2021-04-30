import app from '../app';
import { authChecker } from './../middleware/authChecker';
import { workspaceController } from '../controller/workspace';

// 실제 요청 처리하기 전 access token 확인
app.use('/workspace', authChecker);

//workspace(칸반보드) 데이터 보내주기
app.get('/workspace', workspaceController.get);

// 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
app.post('/workspace', workspaceController.post);
