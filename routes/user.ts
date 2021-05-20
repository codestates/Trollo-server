import express from 'express';
import { emailController } from '../Auth/nodemailer';
import { emailAuthController } from '../controller/emailauth';
import { oauthController } from '../controller/loginOAuth';
import { refreshController } from '../controller/refresh';
const userRouter = express.Router();

// 로그인 - nodemailer
userRouter.post('/mail', emailController);
userRouter.post('/emailauth', emailAuthController.authorizationCode);

// 로그인 - OAuth 방식: google, github
userRouter.post('/loginOAuthGoogle', oauthController.google);
userRouter.post('/loginOAuthGithub', oauthController.github);

// refresh token으로 새로운 access token 발급
userRouter.post('/refresh', refreshController);

export default userRouter;
