import express from 'express';

const workspaceController = {
    get: (req: express.Request, res: express.Response) => {
        // workspace(칸반보드) 데이터 보내주기
    },
    post: (req: express.Request, res: express.Response) => {
        // 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
    },
}

export { workspaceController }