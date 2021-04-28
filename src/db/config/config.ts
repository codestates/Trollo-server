import * as dotenv from 'dotenv';
dotenv.config();
type NODE_ENV = {
	[index: string]: any; // 어쩔수없는 any부분
};
export const Config: NODE_ENV = {
	development: {
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		port: 3306,
		host: 'localhost',
		dialect: 'mysql',
	},
	test: {
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		port: 3306,
		host: 'localhost',
		dialect: 'mysql',
	},
	production: {
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		port: 3306,
		host: 'localhost',
		dialect: 'mysql',
	},
};
