const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

export async function accessTokenGenerator(id: number, email: string) {
	let token: string | undefined = jwt.sign(
		{
			userId: id,
			email: email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2시간
		},
		process.env.ACCESS_SECRET,
		// (err: Error | null, encoded: string | undefined) => {
		// 	if (err) {
		// 		console.log(err);
		// 		return new Error('Not generation AccessToken');
		// 	}
		// 	console.log('at', encoded);
		// 	token = encoded;
		// },
	);
	console.log('uat', token);
	return token;
}
