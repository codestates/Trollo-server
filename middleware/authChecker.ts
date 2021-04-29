import jwt, { VerifyErrors } from 'jsonwebtoken';
// import jwtObj from '../config/jwt';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { accessTokenGenerator } from '../Auth/GenerateAccessToken';
dotenv.config();

export const authChecker = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split('Bearer ')[1];

		jwt.verify(token, process.env.ACCESS_SECRET as string, err => {
			if (err) {
				// 기간만료 ? 맞다.
				// 그럼이제 리프레시토큰을 이용해서 액세스토큰 재발급
				// 그럼 두가지 분기처리를 해야한다, 리프레시토큰이없거나,만료되었거나해서 리다이렉트 로그인페이지
				// 다시 액세스토큰을 내려주거나
				// res.status(401).json({ error: 'expired!' });
				const refresh = req.cookies.refreshToken;
				if (refresh) {
					//리프레시토큰 존재
					jwt.verify(
						refresh,
						process.env.REFRESH_SECRET as string,
						async (err: VerifyErrors | null, decoded: any | undefined) => {
							if (err) {
								//리프레시토큰 정상적이지않음,
								res.redirect('http://trollo.s3-website.ap-northeast-2.amazonaws.com/Login');
							} else {
								res.redirect('http://localhost:4000/refresh');
							}
						},
					);
				} else {
					//없음
					res.redirect('http://trollo.s3-website.ap-northeast-2.amazonaws.com/Login');
				}
			} else {
				next();
			}
		});
	} else {
		// 토큰 없을때
		res.redirect('http://localhost:4000/refresh');
	}
};
