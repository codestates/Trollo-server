import { Request, Response } from 'express';
import { Workspaces, WorkspaceAttributes } from '../src/db/models/workspace';
import { Tasks, TaskAttributes } from '../src/db/models/task';
import { Users } from '../src/db/models/user';
import checkListModel from '../src/db/models/checkList';

const workspaceController = {
	get: async (req: Request, res: Response) => {
		// workspace(칸반보드) 데이터 보내주기
		console.log('🧡workspaceGet - workspace(칸반보드) 데이터 보기');
		// response에 {taskList , taskItem} 으로 내려줘야함.
		//테스크리스트 모양만들기에 필요한 데이터들 : title,tasks:[](안에 taskid)
		const email = req.userEmail;
		const userId = req.userId;
		if (userId) {
			const user_id = userId;
			const workspace = await Workspaces.findAll({ where: { user_id }, order: [['index', 'ASC']] });
			const tasks = await Tasks.findAll({ where: { user_id }, order: [['index', 'ASC']] });
			const res_taskList = [];
			for (let i = 0; i < workspace.length; i++) {
				const id = workspace[i].get('id');
				const taskArr = tasks
					.filter(el => el.tasklist_id === id)
					.map(el => {
						return el.get('id');
					});
				res_taskList.push(
					Object.assign(
						{},
						{ title: workspace[i].get('title'), tasks: taskArr, color: workspace[i].get('color') },
					),
				);
			}
			// 각 taskList id 에 맞는 taskItem을 조회해서 id만 tasks 배열에 담는다.
			const res_taskItem: {
				[index: number]: any;
			} = {};
			for (let i = 0; i < tasks.length; i++) {
				let id = tasks[i].get('id') as number;
				const checkList = await checkListModel.findOne({ tasksId: id });
				if (checkList) {
					res_taskItem[id] = Object.assign(
						{},
						{
							title: tasks[i].title,
							description: tasks[i].desc,
							start_date: tasks[i].start_date,
							end_date: tasks[i].end_date,
							checkList: JSON.parse(checkList.body),
						},
					);
				} else {
					res_taskItem[id] = Object.assign(
						{},
						{
							title: tasks[i].title,
							description: tasks[i].desc,
							start_date: tasks[i].start_date,
							end_date: tasks[i].end_date,
							checkList: [],
						},
					);
				}
			}
			console.log(res_taskList, res_taskItem);
			res.send({ taskList: res_taskList, taskItem: res_taskItem });
		}
	},
	post: async (req: Request, res: Response) => {
		// 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
		console.log('🧡workspacePost - workspace(칸반보드) 데이터 저장');
		const email = req.userEmail;
		const { taskList, taskItem } = req.body;
		//테스크리스트 : [ {id,타이틀, 테스크스(배열= 테스크아이템에 매칭되는 키값이 들어있음)} , ... ]
		//테스크아이템 : {테스크아이템키값:{고유id,title,desc,start_date,end_date,checkList(이건배열)} }
		//checkList(이건배열) -> 내부는 {content, checked} 인 객체
		//쿼리문에 필요한 한 레코즈 속성 : title: string ,user_id: number,index: number;
		const userId = req.userId;
		if (userId) {
			const user_id = userId;
			const tasks_id = await Tasks.findAll({ where: { user_id } });
			let taskIds: any[] = [];
			if (tasks_id) {
				//[...new Set(array)]
				taskIds = [
					...new Set(
						tasks_id.map(el => {
							return el.get('tasklist_id');
						}),
					),
				];
			}
			if (userId && taskList && taskItem) {
				await Tasks.destroy({ where: { user_id } });
				await Workspaces.destroy({ where: { user_id } });
				for (let i = 0; i < taskIds.length; i++) {
					await checkListModel.deleteMany({ tasksId: taskIds[i] });
				}

				// const user_id = user.get('id') as number;
				const bulkQueryWorkspace = [] as WorkspaceAttributes[];
				const bulkQueryTask = [] as TaskAttributes[];
				for (let i = 0; i < taskList.length; i++) {
					bulkQueryWorkspace.push(
						Object.assign(
							{},
							{ title: taskList[i].title, user_id, index: i, color: taskList[i].color },
						),
					);
				}
				//테스크리스트에 보낼 벌크쿼리 완성
				const tempWorkspaceCheck = await Workspaces.bulkCreate(bulkQueryWorkspace);
				//쿼리문에 필요한 테스크 레코즈 속성 :
				//title: str , checklist: str,start_date,end_date ,tasklist_id: num,index: num

				for (let i = 0; i < taskList.length; i++) {
					let task = await Workspaces.findOne({ where: { title: taskList[i].title } });
					let id = task?.get('id') as number;
					// taskList[i].tasks.map((el: any, index: number) => {
					// 	const { title, description, start_date, end_date, checkList } = taskItem[el];
					// 	const McheckList = new checkListModel({
					// 		tasksId: id,
					// 		body: JSON.stringify(checkList),
					// 	});
					// 	await McheckList.save()
					// 		// .then(result => {
					// 		// 	console.log('mongoDB 체크리스트 저장완료');
					// 		// })
					// 		// .catch(error => {
					// 		// 	console.log('mongoDB 체크리스트 저장실패');
					// 		// });
					// 	bulkQueryTask.push(
					// 		Object.assign(
					// 			{},
					// 			{ title, tasklist_id: id, index, start_date, end_date, desc: description, user_id },
					// 		),
					// 	);
					// });
					for (let j = 0; j < taskList[i].tasks.length; j++) {
						const el = taskList[i].tasks[j];
						const index = j;
						const { title, description, start_date, end_date, checkList } = taskItem[el];
						const McheckList = new checkListModel({
							tasksId: id,
							body: JSON.stringify(checkList),
						});
						await McheckList.save();
						// .then(result => {
						// 	console.log('mongoDB 체크리스트 저장완료');
						// })
						// .catch(error => {
						// 	console.log('mongoDB 체크리스트 저장실패');
						// });
						bulkQueryTask.push(
							Object.assign(
								{},
								{ title, tasklist_id: id, index, start_date, end_date, desc: description, user_id },
							),
						);
					}
				}
				const tempTaskCheck = await Tasks.bulkCreate(bulkQueryTask);
				res.send('added workspace table;');
			}
		}
	},
};

export { workspaceController };
