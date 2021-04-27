import {Request,Response} from 'express'
import mongoose from 'mongoose';
import commentModel from '../models/comment'

// interface 
interface Comment extends mongoose.Document{
  userId:number;
  content:string;
  children:Array<Comment>
  createdAt:Date
}
const commentCreate = (req:Request,res:Response)=>{
    console.log(req.body)
    const { boardId,commentArray} = req.body;
    const body:Array<Comment> = [] as Array<Comment>
    const comment = new commentModel({
        boardId:boardId,
        comment:[
           {_id: new mongoose.Types.ObjectId,}
        ]
        
    })
    // new mongoose.Types.ObjectId 유니크값 생성기 같은 느낌이다. 아이디생성용

    return comment.save()
    .then(result=>{
        return res.status(201).json({
            comment:result
        })
    })
    .catch(error=>{
        return res.status(500).json({
            message:error.message,
            error
        });
    })
}

export default {commentCreate}