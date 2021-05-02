import mongoose from 'mongoose';

// interface
interface CheckList extends mongoose.Document {
	tasksId: number;
	body: any;
	createdAt: Date;
}

// Define Schemes
const checkListSchema = new mongoose.Schema(
	{
		//   id: {type:Number,required:true,unique:true},
		//id 테이블은 비공개로 생성된 _id로
		tasksId: { type: Number, require: true, unique: true },
		// 그 게시글의 아이디는 고유해야하고, 게시글당 하나의 레코즈를 가진다.
		body: { type: String, default: null },
	},
	{
		timestamps: true,
	},
);
checkListSchema.static('findOneOrCreate', async function findOneOrCreate(tasksId, doc: CheckList) {
	const one = await this.findOne({ tasksId });
	console.log(one);
	console.log(doc);
});

// Create Model & Export
export default mongoose.model<CheckList>('checkList', checkListSchema);
