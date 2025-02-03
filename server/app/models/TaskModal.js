import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String },
    email: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Task = mongoose.model('tasks', TaskSchema);

export default Task;

