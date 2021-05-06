import mongoose from 'mongoose';

interface Comment extends mongoose.Document {
	user_email: string;
	comment_body: string;
	user_id: number;
	board_id: number;
	parent_id?: string;
}

const commentSchema = new mongoose.Schema(
	{
		user_email: { type: String, require: true },
		user_id: { type: Number, require: true },
		board_id: { type: Number, require: true },
		comment_body: { type: String, require: true },
		parent_id: { type: String, default: null },
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

export default mongoose.model<Comment>('comment', commentSchema);
