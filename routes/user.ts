import app from '../app';
import { userController } from '../controller/user';

// 로그인
app.post('/login', userController.login);

// 로그인 - OAuth 방식
app.post('/loginOAuth', userController.loginOAuth);

// 회원가입
app.post('/register', userController.register);

// 로그아웃
app.get('/logout', userController.logout);
