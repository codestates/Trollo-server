import express from 'express';
import cors from 'cors';
import './init/mongo';
import 'dotenv/config';
import boardRouter from './routes/board';
import userRouter from './routes/user';
import workspaceRouter from './routes/workspace';
const cookieParser = require('cookie-parser');

class App {
	public application: express.Application;

	constructor() {
		this.application = express();
		this.router();
	}

	private router(): void {
		this.application.get('/', (req: express.Request, res: express.Response) => {
			res.send("hello! It's Trollo Server!");
		});
	}
}

const app = new App().application;

const corsOption = {
	Headers: { 'content-type': 'application/json' },
	origin: true,
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
app.use('/', userRouter);
app.use('/', boardRouter);
app.use('/', workspaceRouter);
app.listen(4000, () => {
	console.log('Server listening on port 4000');
});
export default app;
