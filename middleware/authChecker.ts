import jwt, { VerifyErrors } from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import * as dotenv from 'dotenv';
dotenv.config();

export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('어스체커 실행중');
	// console.log(req.headers);
	if (req.headers.authorization) {
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const LoginType = req.headers.logintype;
		console.log(accessToken, LoginType);
		if (LoginType === 'email') {
			// 로그인 방식 - email
			jwt.verify(
				accessToken,
				process.env.ACCESS_SECRET as string,
				(err: VerifyErrors | null, decoded: any | null) => {
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
										res.redirect(`${process.env.CLIENT_URL}/login`);
									} else {
										// 새로운 access token을 발급받음
										const id = decoded.userId;
										const email = decoded.email;
										const newAccessToken = await accessTokenGenerator(id, email);
										req.newAccessToken = newAccessToken;
										req.user_email = email;
									}
								},
							);
						} else {
							// refresh token 없음
							res.redirect(`${process.env.CLIENT_URL}/login`);
						}
					} else {
						// access token 만료되지 않음
						req.newAccessToken = accessToken;
						// console.log('여기까지 도달했음');
						req.user_email = decoded.email;
						// res.locals.email = decoded.email;
						// res.body.user_email = decoded.email;
					}
				},
			);
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
			// access token으로 유저 정보 가져오기
			const googleInfoURL = 'https://www.googleapis.com/oauth2/v3/userinfo';
			const resInfo = await axios
				.get(googleInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.email)
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log(err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);
				});
			req.user_email = resInfo;
		} else if (LoginType === 'github') {
			// 로그인 방식 - github
			// refresh token이 없음, 로그아웃 하기 전까지 access token 계속 사용 가능
			req.newAccessToken = accessToken;
			// access token으로 유저 정보 가져오기
			const githubInfoURL = 'https://api.github.com/user';
			const resInfo = await axios
				.get(githubInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => {
					console.log('result.data - ', result.data);
					return result.data.login;
				})
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log(err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);
				});
			req.user_email = `${resInfo}@github.com`;
		}
		// 실제 요청으로 넘어감
		// req.user_email: 유저 이메일 정보 저장, 실제 요청에서 사용 가능
		// 나중에 응답 보낼때 accessToken에 req.newAccessToken을 넣어주면 됨
		next();
	} else {
		// access token이 없을 때 -> 로그인 페이지로 돌아감
		res.redirect(`${process.env.CLIENT_URL}/login`);
	}
};
