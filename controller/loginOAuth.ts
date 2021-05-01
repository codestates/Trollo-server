import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
import { Users } from '../src/db/models/user';

const oauthController = {
	google: async (req: Request, res: Response) => {
		//로그인 - OAuth 방식: google
		const googleLoginURL = 'https://accounts.google.com/o/oauth2/token';
		const googleInfoURL = 'https://www.googleapis.com/oauth2/v3/userinfo';
		// authorization code를 이용해 access token을 발급받음
		await axios
			.post(googleLoginURL, {
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				code: req.body.authorizationCode,
				redirect_uri: process.env.CLIENT_URL,
				grant_type: 'authorization_code',
			})
			.then(async result => {
				let accessToken = result.data.access_token;
				let refreshToken = result.data.refresh_token;
				// accessToken을 통해 로그인한 유저 정보 가져오기
				const resInfo = await axios
					.get(googleInfoURL, {
						headers: {
							authorization: `Bearer ${accessToken}`,
						},
					})
					.then(result => result.data.email)
					.catch(err => {
						console.log(err.message);
					});
				// 유저정보 확인하여 새로운 유저면 데이터베이스에 저장
				const userInfo = await Users.findOne({
					where: {
						email: resInfo,
					},
				});
				if (userInfo == null && resInfo !== undefined) {
					await Users.create({
						email: resInfo,
					});
				}
				// cookie에 refresh token 저장
				res.cookie('refreshToken', refreshToken, {
					maxAge: 1000 * 60 * 60 * 24 * 7,
					httpOnly: true,
				});
				// access token과 loginType, email을 응답으로 보내줌
				res.status(200).json({
					accessToken,
					LoginType: 'google',
					email: resInfo,
				});
			})
			.catch(err => {
				console.log(err.message);
				res.status(401).json({
					message: 'authorizationCode Error!',
				});
			});
	},
	github: async (req: Request, res: Response) => {
		//로그인 - OAuth 방식: github
		console.log('💙github- ', req.body);
		const githubLoginURL = 'https://github.com/login/oauth/access_token';
		const githubInfoURL = 'https://api.github.com/user';
		// authorization code를 이용해 access token을 발급받음
		await axios
			.post(
				githubLoginURL,
				{
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code: req.body.authorizationCode,
				},
				{
					headers: {
						accept: 'application/json',
					},
				},
			)
			.then(async result => {
				let accessToken = result.data.access_token;
				// accessToken을 통해 로그인한 유저 정보 가져오기
				const resInfo = await axios
					.get(githubInfoURL, {
						headers: {
							authorization: `Bearer ${accessToken}`,
						},
					})
					.then(result => {
						//console.log('result.data - ', result.data);
						return result.data.login;
					})
					.catch(err => {
						console.log(err.message);
					});
				// 유저정보 확인하여 새로운 유저면 데이터베이스에 저장
				const userInfo = await Users.findOne({
					where: {
						email: `${resInfo}@github.com`,
					},
				});
				if (userInfo == null && resInfo !== undefined) {
					await Users.create({
						email: `${resInfo}@github.com`,
					});
				}
				// access token과 loginType을 응답으로 보내줌
				console.log('🧡response - ', accessToken);
				res.status(200).json({
					accessToken,
					LoginType: 'github',
					email: `${resInfo}@github.com`,
				});
			})
			.catch(err => {
				console.log(err.message);
				res.status(401).json({
					message: 'authorizationCode Error!',
				});
			});
	},
};

export { oauthController };
