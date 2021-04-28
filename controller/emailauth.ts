import express from 'express';
const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';
dotenv.config();
import { Users } from '../src/db/models/user';

// const User = require('../src/db/models/');

const emailAuthController = {
	authorizationCode: async (req: express.Request, res: express.Response) => {
		//오소리코드 확인
		console.log(req.query);
		const authorizationCode: string = (await req.query.authorizationCode) as string;
		const email: string = (await req.query.email) as string;
		// console.log(authorizationCode);
		jwt.verify(
			authorizationCode,
			process.env.AUTHORIZATION_SECRET,
			async (err: Error | null, decoded: any) => {
				// console.log(authorizationCode);
				try {
					if (err) {
						throw new Error('not decoded!');
					} else {
						//디코딩 됬음
						const exp = new Date(decoded.exp * 1000);
						const now = new Date(Date.now());
						console.log(exp, ' vs ', now);
						if (exp > now) {
							//액세스토큰 만들어줌,리프레시토큰만들어줌
							// let data = await Users.findOne({ where: { email: email } });
							// if (!data) {
							// 	let user = await Users.create({ email });
							// 	console.log('터짐?');
							// 	console.log(user);
							// }
							// console.log(data);

							res
								.status(200)
								.send({
									message:
										'accessToken 을 만들어 줄껀데 아직 db연결이 안되서 user테이블의 id를 토큰에 넣을수가 없음 ',
								});
						} else {
							//expired
							res.status(404).send({ message: 'authorizationCode Expired!' });
						}
					}

					res.send({ message: 'decoded OK!' });
				} catch (err) {
					res.status(500).send({ message: 'authorizationCode Error!' });
				}
			},
		);
	},
};

export { emailAuthController };
