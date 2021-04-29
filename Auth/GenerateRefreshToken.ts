const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

export async function refreshTokenGenerator(id: number, email: string) {
	let token: string | undefined = jwt.sign(
		{
			userId: id,
			email: email,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 일주일
		},
		process.env.REFRESH_SECRET,
		// (err: Error | null, encoded: string | undefined) => {
		// 	if (err) {
		// 		console.log(err);
		// 		return new Error('Not generation RefreshToken');
		// 	}
		// 	console.log('rt', encoded);
		// 	token = encoded;
		// },
	);
	console.log('urt', token);
	return token;
}
