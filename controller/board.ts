import express from 'express';

const boardController = {
    boardAll: (req: express.Request, res: express.Response) => {
        // 게시판 글 목록 데이터 보내주기
    },
    boardOne: (req: express.Request, res: express.Response) => {
        // 게시글 상세 내용 + 댓글 데이터 보내주기
    },
    boardDelete: (req: express.Request, res: express.Response) => {
        // 게시글 삭제하기
    },
    commentAdd: (req: express.Request, res: express.Response) => {
        // 댓글 추가하기
    },
    commentDelete: (req: express.Request, res: express.Response) => {
        // 댓글 삭제하기
    },
}

export { boardController }