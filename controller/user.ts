import express from 'express';

const userController = {
    login: (req: express.Request, res: express.Response) => {
        // 로그인
    },
    register: (req: express.Request, res: express.Response) => {
        // 회원가입
    },
    logout:(req: express.Request, res: express.Response) => {
        // 로그아웃
    },
}

export { userController }