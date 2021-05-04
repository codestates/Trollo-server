import app from '../app';
import express from 'express';
import { emailController } from '../Auth/nodemailer';
import { emailAuthController } from '../controller/emailauth';
import { oauthController } from '../controller/loginOAuth';
import { userController } from '../controller/user';
import { refreshController } from '../controller/refresh';
const userRouter = express.Router();

// 로그인
userRouter.post('/login', userController.login);
// 로그인 - nodemailer
userRouter.post('/mail', emailController);
userRouter.post('/emailauth', emailAuthController.authorizationCode);
// 로그인 - OAuth 방식: google, github
userRouter.post('/loginOAuthGoogle', oauthController.google);
userRouter.post('/loginOAuthGithub', oauthController.github);
userRouter.post('/refresh', refreshController);
// 회원가입
userRouter.post('/register', userController.register);

// 로그아웃
userRouter.get('/logout', userController.logout);

export default userRouter;
