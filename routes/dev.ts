// import app from '../app';
import express from 'express';
import commentModel from '../src/db/models/comment';
import controller from '../controller/comment';

const devRouter = express.Router();

//테스트용 라우트로 사용

devRouter.get('/test', (req: express.Request, res: express.Response) => {
	commentModel.find((error, result) => {
		res.send(result);
	});
});
devRouter.post('/test', controller.commentCreate);

export default devRouter;
