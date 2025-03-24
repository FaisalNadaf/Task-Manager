const Task = require('../models/Task');
const path = require('path');

// Create Task with File Upload
const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        const file = req.file ? req.file.filename : null;

        const task = new Task({
            title,
            description,
            priority,
            file,
            user: req.user._id,
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        console.error('Create Task Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Tasks (With Search, Sort, and Pagination)
const getTasks = async (req, res) => {
    try {
        const { page = 1, search = '', sort = '' } = req.query;
        const pageSize = 5;
        const query = {
            user: req.user._id,
            title: { $regex: search, $options: 'i' },
        };

        let taskQuery = Task.find(query);

        // Sort by priority if requested
        if (sort === 'priority') {
            taskQuery = taskQuery.sort({
                priority: 1 // Low < Medium < High (alphabetical sort)
            });
        } else {
            taskQuery = taskQuery.sort({ createdAt: -1 });
        }

        const totalTasks = await Task.countDocuments(query);
        const tasks = await taskQuery
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            tasks,
            currentPage: Number(page),
            totalPages: Math.ceil(totalTasks / pageSize),
            totalTasks
        });
    } catch (err) {
        console.error('Get Tasks Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { title, description, priority, completed } = req.body;
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.completed = completed !== undefined ? completed : task.completed;

        if (req.file) {
            task.file = req.file.filename;
        }
        await task.save();
        res.status(200).json({ message: 'Task updated', task });
    } catch (err) {
        console.error('Update Task Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Delete Task Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };