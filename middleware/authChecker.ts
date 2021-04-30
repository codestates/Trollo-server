import jwt, { VerifyErrors } from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import * as dotenv from 'dotenv';
dotenv.config();

export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	if (req.headers.authorization) {
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const LoginType = req.headers.LoginType;
		if (LoginType === 'email') {
			// 로그인 방식 - email
			jwt.verify(accessToken, process.env.ACCESS_SECRET as string, err => {
				if (err) {
					// 기간만료 ? 맞다.
					// 그럼이제 리프레시토큰을 이용해서 액세스토큰 재발급
					// 그럼 두가지 분기처리를 해야한다, 리프레시토큰이없거나,만료되었거나해서 리다이렉트 로그인페이지
					// 다시 액세스토큰을 내려주거나
					// res.status(401).json({ error: 'expired!' });
					const refreshToken = req.cookies.refreshToken;
					if (refreshToken) {
						// refresh token 존재
						jwt.verify(
							refreshToken,
							process.env.REFRESH_SECRET as string,
							async (err: VerifyErrors | null, decoded: any | undefined) => {
								if (err) {
									// refresh token 정상적이지않음
									res.redirect(`${process.env.CLIENT_URL}/Login`);
								} else {
									// 새로운 access token을 발급받음
									const id = decoded.userId;
									const email = decoded.email;
									const newAccessToken = await accessTokenGenerator(id, email);
									req.newAccessToken = newAccessToken;
								}
							},
						);
					} else {
						// refresh token 없음
						res.redirect(`${process.env.CLIENT_URL}/login`);
					}
				}
			});
		} else if (LoginType === 'google') {
			// 로그인 방식 - google
			// refresh token을 이용하여 새로운 access token을 발급받음
			const googleLoginURL = 'https://accounts.google.com/o/oauth2/token';
			await axios
				.post(googleLoginURL, {
					client_id: process.env.GOOGLE_CLIENT_ID,
					client_secret: process.env.GOOGLE_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: req.cookies.refreshToken,
				})
				.then(async result => {
					let accessToken = result.data.access_token;
					req.newAccessToken = accessToken;
				})
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log(err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);
				});
		} else if (LoginType === 'github') {
			// 로그인 방식 - github
			// refresh token이 없음, 로그아웃 하기 전까지 access token 계속 사용 가능
			req.newAccessToken = accessToken;
		}
		// 실제 요청으로 넘어감
		// 나중에 응답 보낼때 accessToken에 req.newAccessToken을 넣어주면 됨
		next();
	} else {
		// access token이 없을 때 -> 로그인 페이지로 돌아감
		res.redirect(`${process.env.CLIENT_URL}/login`);
	}
};
