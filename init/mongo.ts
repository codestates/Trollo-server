import mongoose from 'mongoose';
import 'dotenv/config';

export const mongoInit = {
	promiseSet: (() => {
		mongoose.Promise = global.Promise;
	})(),
	connection: (() => {
		mongoose
			.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
			.then(() => console.log('Successfully connected to mongodb'))
			.catch(e => console.error(e));
	})(),
};
