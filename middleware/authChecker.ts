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
								res.redirect(`${process.env.CLIENT_URL}/Login`);
							} else {
								// 액세스토큰 새로 발급
								const id = decoded.userId;
								const email = decoded.email;
								const newAccessToken = await accessTokenGenerator(id, email);
								res.send({ message: 'newAccessToken', data: { accessToken: newAccessToken } });
							}
						},
					);
				} else {
					//리프레시 없음
					res.redirect(`${process.env.CLIENT_URL}/Login`);
				}
			} else {
				// 액세스토큰 이상없음 다음꺼로 넘어감
				next();
			}
		});
	} else {
		// 액세스 토큰 없을때
		res.redirect(`${process.env.CLIENT_URL}/Login`);
	}
};
