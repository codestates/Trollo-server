import mongoose from 'mongoose';

// interface
interface Contents extends mongoose.Document {
	board_id: number; // key
	body: any; // JSON strigyfy 해서 넣을 키벨류
	createdAt: Date;
}

// Define Schemes
const contentsSchema = new mongoose.Schema(
	{
		//   id: {type:Number,required:true,unique:true},
		//id 테이블은 비공개로 생성된 _id로
		board_id: { type: Number, require: true, unique: true },
		// 그 게시글의 아이디는 고유해야하고, 게시글당 하나의 레코즈를 가진다.
		body: { type: String, default: null },
	},
	{
		timestamps: true,
	},
);
contentsSchema.static('findOneOrCreate', async function findOneOrCreate(board_id, doc: Contents) {
	const one = await this.findOne({ board_id });
	console.log(one);
	console.log(doc);
});

// Create Model & Export
export default mongoose.model<Contents>('content', contentsSchema);
