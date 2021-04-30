import express from 'express';
const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';
dotenv.config();
import { Users } from '../src/db/models/user';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import { refreshTokenGenerator } from '../Auth/GenerateRefreshToken';
const url = require('url');
// const Users = require('../src/db/models/user');

const emailAuthController = {
	authorizationCode: async (req: express.Request, res: express.Response) => {
		//오소리코드 확인

		// console.log(req.query);
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
							let data = await Users.findOrCreate({ where: { email } });
							let id: number = data[0].get('id') as number;
							const accessToken = await accessTokenGenerator(id, email);
							const refreshToken = await refreshTokenGenerator(id, email);
							console.log('at: ', accessToken, ', rt: ', refreshToken);
							res.cookie('refreshToken', refreshToken as string, {
								maxAge: 1000 * 60 * 60 * 24 * 7,
								httpOnly: true,
								// secure: true,
								// sameOrigin: 'none',
							});
							res.redirect(
								url.format({
									pathname: 'http://9351eda07173.ngrok.io/',
									query: {
										accessToken: accessToken,
									},
								}),
							);
							// res.redirect('/?' + query);
							// 	res
							// 		.status(200).
							// 		.write({ message: 'ok', data: { accessToken: accessToken } })
							// 		.redirect('http://9351eda07173.ngrok.io/');
						} else {
							//expired
							res.status(404).send({ message: 'authorizationCode Expired!' });
						}
					}
				} catch (err) {
					res.status(500).send({ message: 'authorizationCode Error!' });
				}
			},
		);
	},
};

export { emailAuthController };
