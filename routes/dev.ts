// import app from '../app';
import express from 'express';
import commentModel from '../src/db/models/comment';
import controller from '../controller/comment';
import { emailController } from '../Auth/nodemailer';
import { emailAuthController } from '../controller/emailauth';
import { authChecker } from '../middleware/authChecker';
import { oauthController } from '../controller/loginOAuth';
import { workspaceController } from '../controller/workspace';
const devRouter = express.Router();

//테스트용 라우트로 사용

devRouter.get('/test', (req: express.Request, res: express.Response) => {
	commentModel.find((error, result) => {
		res.send(result);
	});
});
devRouter.get('/axios', (req, res) => {
	res.send({ message: '우성님 화이팅!!' });
});
devRouter.post('/test', controller.commentCreate);
devRouter.post('/mail', emailController);
devRouter.post('/emailauth', emailAuthController.authorizationCode);
devRouter.options('/workspace', (req, res) => {
	res.status(200).send({ message: 'options OK' });
});
devRouter.post('/workspace', workspaceController.post);
devRouter.post('/workspaceget', workspaceController.get);
devRouter.get('/my', authChecker, (req, res) => {
	res.send('auth user');
});
devRouter.post('/loginOAuthGoogle', oauthController.google);
devRouter.post('/loginOAuthGithub', oauthController.github);

export default devRouter;
