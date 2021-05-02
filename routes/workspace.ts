import app from '../app';
import { authChecker } from './../middleware/authChecker';
import { workspaceController } from '../controller/workspace';
import express from 'express';
const workspaceRouter = express.Router();
// 실제 요청 처리하기 전 access token 확인
workspaceRouter.use('/workspace', authChecker);

//workspace(칸반보드) 데이터 보내주기
workspaceRouter.get('/workspace', workspaceController.get);

// 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
workspaceRouter.post('/workspace', workspaceController.post);

export default workspaceRouter;
