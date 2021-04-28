import express from 'express';
import cors from 'cors';
import './init/mongo';
import 'dotenv/config';
import devRouter from './routes/dev';
const cookieParser = require('cookie-parser');
class App {
	public application: express.Application;

	constructor() {
		this.application = express();
		this.router();
	}

	private router(): void {
		this.application.get('/', (req: express.Request, res: express.Response) => {
			res.send('hello! world!');
		});
	}
}

const app = new App().application;

const corsOption = {
	origin: true,
	method: ['post', 'get', 'delete', 'options'],
	credentials: true,
};
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
app.use('/', devRouter);
app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
export default app;
