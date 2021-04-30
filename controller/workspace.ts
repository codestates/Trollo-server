import { Request, Response } from 'express';
import { Workspaces, WorkspaceAttributes } from '../src/db/models/workspace';
import { Tasks, TaskAttributes } from '../src/db/models/task';
import { Users } from '../src/db/models/user';
const workspaceController = {
	get: (req: Request, res: Response) => {
		// workspace(칸반보드) 데이터 보내주기
	},
	post: async (req: Request, res: Response) => {
		// 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
		const { email, taskList, taskItem } = req.body;
		//테스크리스트 : [ {id,타이틀, 테스크스(배열= 테스크아이템에 매칭되는 키값이 들어있음)} , ... ]
		//테스크아이템 : {테스크아이템키값:{고유id,title,desc,start_date,end_date,checkList(이건배열)} }
		//checkList(이건배열) -> 내부는 {content, checked} 인 객체
		//쿼리문에 필요한 한 레코즈 속성 : title: string ,user_id: number,index: number;
		const user = await Users.findOne({ where: { email } });
		if (user) {
			const user_id = user.get('id') as number;
			await Workspaces.destroy({ where: { user_id } });
			await Tasks.destroy({ where: { user_id } });
		}
		if (user && taskList && taskItem) {
			const user_id = user.get('id') as number;
			const bulkQueryWorkspace = [] as WorkspaceAttributes[];
			const bulkQueryTask = [] as TaskAttributes[];
			for (let i = 0; i < taskList.length; i++) {
				bulkQueryWorkspace.push(Object.assign({}, { title: taskList[i].title, user_id, index: i }));
			}
			//테스크리스트에 보낼 벌크쿼리 완성
			console.log(bulkQueryWorkspace);
			const tempWorkspaceCheck = await Workspaces.bulkCreate(bulkQueryWorkspace);
			console.log(tempWorkspaceCheck);
			//쿼리문에 필요한 테스크 레코즈 속성 :
			//title: str , checklist: str,start_date,end_date ,tasklist_id: num,index: num

			for (let i = 0; i < taskList.length; i++) {
				let task = await Workspaces.findOne({ where: { title: taskList[i].title } });
				let id = task?.get('id') as number;
				taskList[i].tasks.map((el: any, index: number) => {
					const { title, description, start_date, end_date } = taskItem[el];
					bulkQueryTask.push(
						Object.assign(
							{},
							{ title, tasklist_id: id, index, start_date, end_date, desc: description, user_id },
						),
					);
				});
			}
			console.log(bulkQueryTask);

			const tempTaskCheck = await Tasks.bulkCreate(bulkQueryTask);
			console.log(tempTaskCheck);
			res.send('added workspace table;');
		}
	},
};

export { workspaceController };
