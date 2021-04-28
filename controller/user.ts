import express from 'express';
import axios from 'axios';

// const User = require('../src/db/models/');
const userController = {
	login: (req: express.Request, res: express.Response) => {
		//로그인
	},
	loginOAuth: async (req: express.Request, res: express.Response) => {
		// 로그인 - OAuth 방식
		let oauthServer = req.body.oauthServer;
		if (oauthServer === 'google') {
			//
		} else if (oauthServer === 'github') {
			const githubLoginURL = 'https://github.com/login/oauth/access_token';
			const githubInfoURL = 'https://api.github.com/user';
			// authorization code를 이용해 access token을 발급받음
			const accessToken = axios
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
				.then(result => result.data.access_token)
				.catch(err => {
					console.log(err.message);
					res.status(400).json({
						message: 'error',
					});
				});
			// accessToken을 통해 로그인한 유저 정보 가져오기
			const resInfo = await axios
				.post(githubInfoURL, {
					headers: {
						authorization: `token ${accessToken}`,
						accept: 'application/json',
					},
				})
				.then(result => result.data.login)
				.catch(err => {
					console.log(err.message);
				});
			// 여기서 바로 데이터베이스랑 통신해서 유저정보를 저장하는 것도 좋을듯 -> 우선 보류
			// response 보내기
			res.status(200).json({
				accessToken,
			});
		}
	},
	register: (req: express.Request, res: express.Response) => {
		// 회원가입
	},
	logout: (req: express.Request, res: express.Response) => {
		// 로그아웃
	},
};

export { userController };
