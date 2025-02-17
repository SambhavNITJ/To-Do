import User from '../schema/user.model.js';
import ApiError from '../utils/error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, 'Email and Password required');
        }


        const alreadyExists = await User.findOne({ email });
        if (alreadyExists) {
            throw new ApiError(409, 'User already exists');
        }


        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { _id: newUser._id, email: newUser.email }
        });

    } catch (error) {
        // Ensure thrown errors are properly caught
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, 'Email and Password required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, 'User not registered');
        }

        if (!user.password) {
            throw new ApiError(500, 'User password is missing in the database');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
        });

        return res.status(200).json({ message: 'User logged in successfully' });

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        } 
        
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }
        res.clearCookie('token', options).status(200).json({ message: 'User logged out successfully' });

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}





export {register, login, logout};