import mongoose from 'mongoose';

interface Contents extends mongoose.Document {
	board_id: number;
	body: any;
	createdAt: Date;
}

const contentsSchema = new mongoose.Schema(
	{
		board_id: { type: Number, require: true, unique: true },
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

export default mongoose.model<Contents>('content', contentsSchema);
