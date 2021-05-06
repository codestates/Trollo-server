import mongoose from 'mongoose';

interface CheckList extends mongoose.Document {
	tasksId: number;
	body: any;
	createdAt: Date;
}

const checkListSchema = new mongoose.Schema(
	{
		tasksId: { type: Number, require: true, unique: true },
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

export default mongoose.model<CheckList>('checkList', checkListSchema);
