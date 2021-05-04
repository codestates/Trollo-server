import { Request, Response } from 'express';
import axios from 'axios';
import { Users } from '../src/db/models/user';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { accessTokenGenerator } from 'Auth/GenerateAccessToken';

export const refreshController = async (req: Request, res: Response) => {
	//LoginType에 대한 분기처리
	if (req.cookies.refreshToken) {
		const { refreshToken } = req.cookies.refreshToken;
		switch (req.headers.logintype) {
			case 'email': {
				await jwt.verify(
					refreshToken,
					process.env.REFRESH_SECRET as string,
					async (err: VerifyErrors | null, decoded: any | null) => {
						if (err) {
							// 잘못된 토큰이거나, 만기된토큰일경우 err
							res.status(404).send({ message: 'invalid refreshToken' }).end();
						} else {
							const accessToken = await accessTokenGenerator(decoded.userId, decoded.email);
							res.status(200).send({ accessToken }).end();
						}
					},
				);
				break;
			}

			case 'google':
				break;
			case 'github':
				break;
			default:
				return;
		}
	}
};
