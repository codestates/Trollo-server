import express from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
dotenv.config();
const refreshTokenController = {
	refresh: (req: express.Request, res: express.Response) => {
		//액세스토큰 만들어줘야함.
		// console.log('디코디드', decoded);
		const token = req.cookies.refreshToken;
		jwt.verify(
			token,
			process.env.REFRESH_SECRET as string,
			async (err: VerifyErrors | null, decoded: any | undefined) => {
				if (err) {
					console.log('refreshToken만료 or 없음');
					res.redirect('http://trollo.s3-website.ap-northeast-2.amazonaws.com/Login');
				} else {
					const id = decoded.userId;
					const email = decoded.email;
					const newAccessToken = await accessTokenGenerator(id, email);
					res.send({ message: 'newAccessToken', data: { accessToken: newAccessToken } });
				}
			},
		);
	},
};

export { refreshTokenController };
