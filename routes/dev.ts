// import app from '../app';
import express from 'express';
import commentModel from '../src/db/models/comment';
import controller from '../controller/comment';
import { emailController } from '../Auth/nodemailer';
import { emailAuthController } from '../controller/emailauth';
const devRouter = express.Router();

//테스트용 라우트로 사용

devRouter.get('/test', (req: express.Request, res: express.Response) => {
	commentModel.find((error, result) => {
		res.send(result);
	});
});
devRouter.post('/test', controller.commentCreate);
devRouter.get('/mail', emailController);
devRouter.get('/emailauth', emailAuthController.authorizationCode);
export default devRouter;
