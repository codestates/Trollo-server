import mongoose from 'mongoose';

// interface
interface Comment extends mongoose.Document {
	user_email: string;
	comment_body: string;
	user_id: number;
	// children: Array<Comment>;
	board_id: number;
}

// Define Schemes
const commentSchema = new mongoose.Schema(
	{
		//   id: {type:Number,required:true,unique:true},
		//id 테이블은 비공개로 생성된 _id로
		user_email: { type: String, require: true },
		user_id: { type: Number, require: true },
		board_id: { type: Number, require: true },
		// 그 게시글의 아이디는 고유해야하고, 게시글당 하나의 레코즈를 가진다.
		comment_body: { type: String, default: null, require: true },
	},
	{
		timestamps: true,
	},
);
commentSchema.static('findOneOrCreate', async function findOneOrCreate(board_id, doc: Comment) {
	const one = await this.findOne({ board_id });
	console.log(one);
	console.log(doc);
});

// Create Model & Export
export default mongoose.model<Comment>('comment', commentSchema);
