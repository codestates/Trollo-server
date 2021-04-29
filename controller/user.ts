import { Request, Response } from 'express';
import axios from 'axios';
import { Users } from '../src/db/models/user';

const userController = {
	login: (req: Request, res: Response) => {
		//로그인
	},
	register: (req: Request, res: Response) => {
		// 회원가입
	},
	logout: (req: Request, res: Response) => {
		// 로그아웃
	},
};

export { userController };
