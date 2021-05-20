import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';
dotenv.config();
import { Users } from '../src/db/models/user';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import { refreshTokenGenerator } from '../Auth/GenerateRefreshToken';
const url = require('url');

const emailAuthController = {
	authorizationCode: async (req: Request, res: Response) => {
		console.log('💙login: email- ', req.body);
		const authorizationCode: string = (await req.body.authorizationCode) as string;
		const email: string = (await req.body.email) as string;
		// authorization code를 이용해 access token을 발급
		jwt.verify(
			authorizationCode,
			process.env.AUTHORIZATION_SECRET,
			async (err: Error | null, decoded: any) => {
				try {
					if (err) {
						throw new Error('not decoded!');
					} else {
						// decoded
						const exp = new Date(decoded.exp * 1000);
						const now = new Date(Date.now());
						console.log(exp, ' vs ', now);
						if (exp > now) {
							// access token, refresh token 생성
							let data = await Users.findOrCreate({
								where: {
									email,
								},
							});
							let id: number = data[0].get('id') as number;
							const accessToken = await accessTokenGenerator(id, email);
							const refreshToken = await refreshTokenGenerator(id, email);
							console.log('💙email: at - ', accessToken, '\n💙email: rt - ', refreshToken);
							// refresh token 저장
							res.cookie('refreshToken', refreshToken as string, {
								maxAge: 1000 * 60 * 60 * 24 * 7,
								httpOnly: true,
								// secure: true,
								// sameOrigin: 'none',
							});
							console.log('쿠키삽입함');
							// access token과 loginType을 응답으로 보내줌
							res.status(200).json({
								accessToken,
								email,
								LoginType: 'email',
							});
						} else {
							//expired
							res.status(403).json({
								message: 'authorizationCode Expired!',
							});
						}
					}
				} catch (err) {
					console.log('💙email: ', err.message);
					res.status(401).json({
						message: 'authorizationCode Error!' + err.message,
					});
				}
			},
		);
	},
};

export { emailAuthController };
