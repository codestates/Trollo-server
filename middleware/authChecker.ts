import jwt, { VerifyErrors } from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import { Users } from '../src/db/models/user';
import * as dotenv from 'dotenv';
dotenv.config();
interface Itoken {
	userId: number;
	email: string;
	iat: number;
	exp: number;
}
export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
	console.log('🔒authChecker 실행합니다 - headers: ', req.headers);
	if (req.headers.authorization) {
		const accessToken = req.headers.authorization.split('Bearer ')[1];
		const LoginType = req.headers.logintype;
		if (LoginType === 'email') {
			// 로그인 방식 - email
			try {
				const decoded = (await jwt.verify(
					accessToken,
					process.env.ACCESS_SECRET as string,
				)) as Itoken;
				console.log(decoded);
				// if (decoded가 err일 조건) {
				// access toekn : 기간 만료
				// const refreshToken = req.cookies.refreshToken;
				// if (refreshToken) {
				// 	// refresh token : 존재 -> 정상인지 확인해야함
				// 	jwt.verify(
				// 		refreshToken,
				// 		process.env.REFRESH_SECRET as string,
				// 		async (err: VerifyErrors | null, decoded: any | undefined) => {
				// 			if (err) {
				// 				// refresh token : 정상적이지 않음 -> 로그인으로 돌아감
				// 				res.redirect(`${process.env.CLIENT_URL}/login`);
				// 			} else {
				// 				// 새로운 access token을 발급 받음
				// 				const id = decoded.userId;
				// 				const email = decoded.email;
				// 				const newAccessToken = await accessTokenGenerator(id, email);
				// 				req.newAccessToken = newAccessToken;
				// 			}
				// 		},
				// 	);
				// } else {
				// 	// refresh token : 없음
				// 	res.redirect(`${process.env.CLIENT_URL}/login`);
				// }
				// } else{
				// access token : 만료되지 않음
				if (typeof decoded !== 'string') {
					req.user_email = decoded.email;
					req.user_id = decoded.userId;
				}
			} catch (err) {
				//err handling
			}
		} else if (LoginType === 'google') {
			// 로그인 방식 - google
			// refresh token을 이용하여 새로운 access token을 발급받음
			// const googleLoginURL = 'https://accounts.google.com/o/oauth2/token';
			// await axios
			// 	.post(googleLoginURL, {
			// 		client_id: process.env.GOOGLE_CLIENT_ID,
			// 		client_secret: process.env.GOOGLE_CLIENT_SECRET,
			// 		grant_type: 'refresh_token',
			// 		refresh_token: req.cookies.refreshToken,
			// 	})
			// 	.then(async result => {
			// 		let accessToken = result.data.access_token;
			// 		req.newAccessToken = accessToken;
			// 	})
			// 	.catch(err => {
			// 		// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
			// 		console.log('🔒error:google', err.message);
			// 		res.redirect(`${process.env.CLIENT_URL}/login`);
			// 	});
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
					console.log('🔒error:google', err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);
				});
			const userInfo = await Users.findOne({
				where: {
					email: resInfo,
				},
			});
			if (userInfo !== null) {
				req.user_email = resInfo;
				req.user_id = userInfo.get('id') as number;
			} else {
				// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
				res.redirect(`${process.env.CLIENT_URL}/login`);
			}
		} else if (LoginType === 'github') {
			// 로그인 방식 - github
			// refresh token이 없음, 로그아웃 하기 전까지 access token 계속 사용 가능
			// req.newAccessToken = accessToken;
			// access token으로 유저 정보 가져오기
			const githubInfoURL = 'https://api.github.com/user';
			const resInfo = await axios
				.get(githubInfoURL, {
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				})
				.then(result => result.data.login)
				.catch(err => {
					// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
					console.log('🔒error:github', err.message);
					res.redirect(`${process.env.CLIENT_URL}/login`);
				});
			const email = `${resInfo}@github.com`;
			const userInfo = await Users.findOne({
				where: {
					email,
				},
			});
			if (userInfo !== null) {
				req.user_email = email;
				req.user_id = userInfo.get('id') as number;
			} else {
				// 유저 정보를 찾을 수 없음 -> 인증 불가 -> 다시 로그인해야함
				res.redirect(`${process.env.CLIENT_URL}/login`);
			}
		}
		// access token을 확인한 결과를 토대로 결정
		console.log(
			'🔒authChecker result - ',
			LoginType,
			req.user_id,
			req.user_email,
			req.newAccessToken,
		);
		if (req.newAccessToken !== undefined) {
			// 새로운 access token 생성됨 -> 응답으로 보내주어야 함
			// res.status(200).json({
			// 	newAccessToken: req.newAccessToken,
			// });
		} else if (req.user_id !== undefined && req.user_email !== undefined) {
			// 실제 요청으로 넘어감
			console.log('🔒go next function!!');
			next();
		} else {
			// 에러 발생 -> 로그인 페이지로 돌아감
			res.redirect(`${process.env.CLIENT_URL}/login`);
		}
	} else {
		// access token이 없을 때 -> 로그인 페이지로 돌아감
		res.redirect(`${process.env.CLIENT_URL}/login`);
	}
};
