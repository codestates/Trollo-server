import mongoose from 'mongoose';

// interface 
interface Comment extends mongoose.Document{
  userId:number;
  content:string;
  children:Array<Comment>
  createdAt:Date
}

// Define Schemes
const commentSchema = new mongoose.Schema({
//   id: {type:Number,required:true,unique:true}, 
//id 테이블은 비공개로 생성된 _id로
  boardId:{type:String, require:true,unique:true} ,
  // 그 게시글의 아이디는 고유해야하고, 게시글당 하나의 레코즈를 가진다.
  comment:{type:Array<Comment>() ,default:null},
},
{
  timestamps: true
});

commentSchema.static('findOneOrCreate',async function findOneOrCreate(boardId,doc){
    const one = await this.findOne({boardId})
    console.log(one)
})


// Create Model & Export
export default mongoose.model<Comment>('comment',commentSchema);
