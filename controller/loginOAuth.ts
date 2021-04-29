import { Request, Response } from 'express';
import axios from 'axios';
//const jwt = require('jsonwebtoken');
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
				redirect_uri: 'http://localhost:3000', // 클라이언트 리디렉션 uri - 나중에 수정해야함
				grant_type: 'authorization_code',
			})
			.then(async result => {
				let accessToken = result.data.access_token;
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
				if (userInfo == null && userInfo !== undefined) {
					await Users.create({
						email: resInfo,
					});
				}
				res.status(200).json({
					accessToken,
				});
			})
			.catch(err => {
				console.log(err.message);
				res.status(400).json({
					message: 'login error',
				});
			});
	},
	github: async (req: Request, res: Response) => {
		//로그인 - OAuth 방식: github
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
							authorization: `Bearer ${accessToken}`, //`token ${accessToken}`,
						},
					})
					.then(result => result.data.login)
					.catch(err => {
						console.log(err.message);
					});
				// 유저정보 확인하여 새로운 유저면 데이터베이스에 저장
				const userInfo = await Users.findOne({
					where: {
						email: `${resInfo}@github.com`,
					},
				});
				if (userInfo == null && userInfo !== undefined) {
					await Users.create({
						email: `${resInfo}@github.com`,
					});
				}
				res.status(200).json({
					accessToken,
				});
			})
			.catch(err => {
				console.log(err.message);
				res.status(400).json({
					message: 'error',
				});
			});
	},
};

export { oauthController };
