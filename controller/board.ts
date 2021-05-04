import { Request, Response } from 'express';
import { Boards } from '../src/db/models/board';
import { Users } from '../src/db/models/user';
import { Workspaces } from '../src/db/models/workspace';
import { Tasks } from '../src/db/models/task';
import checkListModel from '../src/db/models/checkList';
import contentModel from '../src/db/models/content';
import commentModel from '../src/db/models/comment';

const boardController = {
	boardAll: async (req: Request, res: Response) => {
		// 게시판 글 목록 데이터 보내주기
		console.log('💜boardAll - 게시판 글 목록 보기');
		let boardList = await Boards.findAll();
		res.status(200).json({
			boardList,
		});
	},
	boardOne: async (req: Request, res: Response) => {
		// 게시글 상세 내용 + 댓글 데이터 보내주기
		console.log('💜boardOne - ', req.params);
		const board_id = Number(req.params.board_id);
		const boardData = await Boards.findOne({
			where: {
				id: board_id,
			},
		});
		if (boardData === null) {
			console.log('💜boardOne - ERROR// no board data ', board_id);
			res.status(403).json({
				message: 'no board data Error!',
			});
		} else {
			console.log('💜boardOne - board data ', board_id);
			// board_id를 key로 가지는 칸반보드 데이터 불러오기
			let foundContent = await contentModel.findOne({ board_id });
			// board_id를 key로 가지는 댓글 데이터 불러오기
			let foundComment = await commentModel.find({ board_id });
			// 게시글 상세내용 응답으로 보내주기
			if (foundContent) {
				res.status(200).json({
					writer: boardData.writer,
					title: boardData.title,
					createdAt: boardData.get('createdAt'),
					content: JSON.parse(foundContent.body),
					commentAll: foundComment,
				});
			} else {
				console.log('💜boardOne - ERROR// no content ', board_id);
				res.status(404).json({
					message: 'no content Error!',
				});
			}
		}
	},
	boardAdd: async (req: Request, res: Response) => {
		// 게시글 등록하기
		console.log('💜boardAdd - ', req.body, req.user_email, req.user_id);
		const title = req.body.title;
		if (title !== '') {
			const writer = req.user_email;
			const user_id = req.user_id;
			const newBoard = await Boards.create({
				id: undefined,
				title,
				writer,
				user_id,
			});
			const board_id = newBoard.get('id');
			// board_id를 key로 가지는 칸반보드 데이터 저장
			// 유저가 소유한 칸반보드를 데이터화해주는 과정
			const email = req.user_email; // 유저 정보 어스체커에서 받아옴
			const user = await Users.findOne({ where: { email: email } }); // 유저정보 조회 유저객체
			if (user) {
				const user_id = user.get('id') as number; // 유저객체에서 유저의 등록된 고유 id 받아옴
				const workspace = await Workspaces.findAll({
					where: { user_id },
					order: [['index', 'ASC']],
				});
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
						Object.assign({}, { title: workspace[i].get('title'), tasks: taskArr }),
					);
				}
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
				const Mboard_data = new contentModel({
					board_id, //여기 보드아이디 참고해야함
					body: JSON.stringify({ taskList: res_taskList, taskItem: res_taskItem }),
				});
				Mboard_data.save()
					.then(result => {
						//console.log(result);
					})
					.catch(err => {
						console.log('💜boardAdd - ERROR// ', err.message);
						res.status(500).json({
							message: err.message,
						});
					});
			}
			// board_id를 key로 가지는 댓글 데이터 저장(빈파일? 생성) -> 필요없음
			// 새로 생성된 게시판 글 목록 데이터 보내줌
			let boardList = await Boards.findAll();
			res.status(200).json({
				new_board_id: board_id,
				boardList,
			});
		} else {
			console.log('💜boardAdd - ERROR// no input title ', title);
			res.status(400).json({
				message: 'no input title Error!',
			});
		}
	},
	boardDelete: async (req: Request, res: Response) => {
		// 게시글 삭제하기
		console.log('💜boardDelete - ', req.params);
		const board_id = Number(req.params.board_id);
		await Boards.destroy({
			where: {
				id: board_id,
			},
		});
		// board_id를 key로 가지는 칸반보드 데이터 삭제
		contentModel.deleteOne({ board_id });
		// board_id를 key로 가지는 댓글 데이터 삭제
		commentModel.deleteMany({ board_id });
		// 삭제되었다는 메시지 보내기
		res.status(200).json({
			message: `delete ${board_id} complete`,
		});
	},
};

export { boardController };
