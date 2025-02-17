import moongose from 'mongoose';

const todoSchema = new moongose.Schema({
    userId : {
        type : moongose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'userId is required'],
    }
    ,
    title : {
        type : String,
        required : [true, 'title is required'],
    },

    isCompleted : {
        type : Boolean,
        default : false,
        required : [true, 'Password is required'],  
    }
});

const Todo = moongose.model('Todo', todoSchema);

export default Todo;