// {
//   parent_id: null,
//   _id: 608fa57f7d80414d5a50aba1,
//   board_id: 1,
//   user_id: 1,
//   user_email: 'nsg8957@naver.com',
//   comment_body: '안녕하세요2',
//   createdAt: 2021-05-03T07:25:51.415Z,
//   updatedAt: 2021-05-03T07:25:51.415Z,
//   __v: 0
// },
type comment = {
	board_id: number;
	user_id: number;
	user_email: string;
	createdAt?: Date;
	updatedAt?: Date;
	parent_id: string;
	comment_body: string;
	__v?: any;
	_id?: string;
};
type newComment = {
	board_id: number;
	user_id: number;
	user_email: string;
	createdAt?: Date;
	updatedAt?: Date;
	parent_id: string;
	comment_body: string;
	__v?: any;
	_id?: string;
	children: newComment[];
};

export const commentDisplay = (commentData: any): newComment[] => {
	console.log('💖start display');
	let commentAll: newComment[] = [];
	console.log(commentData, commentData.length);
	for (let idx = 0; idx < commentData.length; idx++) {
		// 1. 형태 변경
		let nowComment: newComment = { ...commentData[idx]['_doc'], children: [] };
		if (nowComment.parent_id === null) {
			console.log(idx, 'push commentAll');
			commentAll.push(nowComment);
		} else {
			console.log('recursive!');
			findParent(commentAll, nowComment);
		}
	}
	function findParent(cmtAll: newComment[], cmt: any) {
		for (let idx = 0; idx < cmtAll.length; idx++) {
			// 멈추는 조건: parent를 찾음!!!!
			//console.log('check', typeof cmt.parent_id, typeof cmtAll[idx]['_id']);
			if (cmt.parent_id === String(cmtAll[idx]['_id'])) {
				//console.log(idx, cmt.parent_id);
				cmtAll[idx].children.push(cmt);
				return true;
			} else if (cmtAll[idx].children.length > 0) {
				// children에서 내 parent가 있는지 재귀로 확인!
				let result = findParent(cmtAll[idx].children, cmt);
				if (result) {
					return true;
				}
			}
			return false;
		}
		// 재귀 조건
		// arr의 데이터를 하나 뽑아서, commentAll에 객체로 넣는데 성공하면 , 다음 arr을 진행한다.
		// 1. cmt[idx] 를 {...cmt[idx],children:[]}의 형태로 만든다
		// 2, cmt[idx]에서 parent_id를 확인한다
		// 3. 해당 parent_id 의 children에 1번을 push 한다
		// 3-1. 재귀로 commentAll을 돌면서 해당 parent_id를 찾는다
	}
	//console.log('💝', commentAll);
	return commentAll;
};
