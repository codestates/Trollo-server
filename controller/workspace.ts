import { Request, Response } from 'express';
import { Workspaces, WorkspaceAttributes } from '../src/db/models/workspace';
import { Tasks, TaskAttributes } from '../src/db/models/task';
import { Users } from '../src/db/models/user';
import checkListModel from '../src/db/models/checkList';
import { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
const workspaceController = {
	get: async (req: Request, res: Response) => {
		// console.log(req.pro)

		// workspace(칸반보드) 데이터 보내주기
		// response에 {taskList , taskItem} 으로 내려줘야함.
		//테스크리스트 모양만들기에 필요한 데이터들 : title,tasks:[](안에 taskid)
		const email = req.user_email;
		const user = await Users.findOne({ where: { email: email } });
		if (user) {
			const user_id = user.get('id') as number;
			const workspace = await Workspaces.findAll({ where: { user_id }, order: [['index', 'ASC']] });
			// console.log(workspace);
			const tasks = await Tasks.findAll({ where: { user_id }, order: [['index', 'ASC']] });
			// console.log(tasks);
			const res_taskList = [];
			for (let i = 0; i < workspace.length; i++) {
				const id = workspace[i].get('id');
				const taskArr = tasks
					.filter(el => el.tasklist_id === id)
					.map(el => {
						return el.get('id');
					});
				// console.log('🥵', taskArr);
				res_taskList.push(Object.assign({}, { title: workspace[i].get('title'), tasks: taskArr }));
			}
			// 각 taskList id 에 맞는 taskItem을 조회해서 id만 tasks 배열에 담는다.

			const res_taskItem: {
				[index: number]: any;
			} = {};
			// console.log(res_taskList);

			for (let i = 0; i < tasks.length; i++) {
				let id = tasks[i].get('id') as number;
				console.log('🥺', id);
				const checkList = await checkListModel.findOne({ tasksId: id });
				console.log('🥵', checkList);
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
			console.log('😮', res_taskItem);

			res.send({ taskList: res_taskList, taskItem: res_taskItem });
		}
	},
	post: async (req: Request, res: Response) => {
		// console.log('👻dddd', res.locals.email);
		// 생성, 수정, 삭제된 workspace(칸반보드) 데이터 저장하기
		const email = req.user_email;
		const { taskList, taskItem } = req.body;
		//테스크리스트 : [ {id,타이틀, 테스크스(배열= 테스크아이템에 매칭되는 키값이 들어있음)} , ... ]
		//테스크아이템 : {테스크아이템키값:{고유id,title,desc,start_date,end_date,checkList(이건배열)} }
		//checkList(이건배열) -> 내부는 {content, checked} 인 객체
		//쿼리문에 필요한 한 레코즈 속성 : title: string ,user_id: number,index: number;
		const user = await Users.findOne({ where: { email } });
		if (user) {
			const user_id = user.get('id') as number;
			await Tasks.destroy({ where: { user_id } });
			await Workspaces.destroy({ where: { user_id } });
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
					const { title, description, start_date, end_date, checkList } = taskItem[el];
					const McheckList = new checkListModel({
						tasksId: id,
						body: JSON.stringify(checkList),
					});
					McheckList.save()
						.then(result => {
							console.log(result);
						})
						.catch(error => {
							return res.status(500).json({
								message: error.message,
								error,
							});
						});
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
