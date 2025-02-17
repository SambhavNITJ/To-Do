import Todo from '../schema/todo.model.js';
import ApiError from '../utils/error.js';

const getAllTodos = async (req, res) => {
    try {
        const Todos = await Todo.find({ userId: req.user._id });
        res.status(200).json(Todos);
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            throw new ApiError(404, 'Todo not found');
        }
        if (todo.userId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'You are not authorized to access this todo');
        }
        res.status(200).json(todo);
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const updateTodo = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new ApiError(400, 'Please provide data to update');
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            throw new ApiError(404, 'Todo not found');
        }
        if (todo.userId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'You are not authorized to update this todo');
        }
        if (req.body.title) {
            todo.title = req.body.title;
        }
        if (req.body.hasOwnProperty("isCompleted")) {
            todo.isCompleted = req.body.isCompleted;
        }
        await todo.save();
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            throw new ApiError(404, 'Todo not found');
        }
        if (todo.userId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'You are not authorized to delete this todo');
        }
        await todo.deleteOne();
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const addTodo = async (req, res) => {
    try {
        if (!req.body.title) {
            throw new ApiError(400, 'Title is required');
        }
        const todo = new Todo({
            userId: req.user._id,
            title: req.body.title,
            isCompleted: req.body.isCompleted || false, // Default to false
        });
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export { getAllTodos, getTodo, updateTodo, deleteTodo, addTodo };
