const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low', },
    completed: { type: Boolean, default: false, },
    file: { type: String, },  // Store the filename or file path
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    }
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);
