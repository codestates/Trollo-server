import { Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const refreshController = async (req: Request, res: Response) => {
	if (req.cookies.refreshToken) {
		const { refreshToken } = req.cookies.refreshToken;
		switch (req.headers.logintype) {
			// LoginType에 대한 분기처리
			case 'email':
				// 로그인 방식 - email
				await jwt.verify(
					refreshToken,
					process.env.REFRESH_SECRET as string,
					async (err: VerifyErrors | null, decoded: any | null) => {
						if (err) {
							// 잘못된 토큰이거나, 만기된 토큰일경우 에러 발생
							res.status(404).json({
								message: 'invalid refreshToken ' + err.message,
							});
						} else {
							// 새로운 access token을 발급받음
							const newAccessToken = await accessTokenGenerator(decoded.userId, decoded.email);
							res.status(200).json({
								newAccessToken,
							});
						}
					},
				);
				break;

			case 'google':
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
						let newAccessToken = result.data.access_token;
						res.status(200).json({
							newAccessToken,
						});
					})
					.catch(err => {
						// 에러 발생 -> 인증 불가 -> 다시 로그인해야함
						console.log('🔒error:google', err.message);
						res.status(404).json({
							message: 'invalid refreshToken ' + err.message,
						});
					});
				break;

			case 'github':
				// 로그인 방식 - github
				res.status(200).json({
					newAccessToken: refreshToken,
				});
				break;

			default:
				return;
		}
	}
};
