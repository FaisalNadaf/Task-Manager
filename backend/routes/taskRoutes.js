const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// File Upload Setup using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Create Task (with file upload)
router.post('/', protect, upload.single('file'), createTask);

// Get Tasks (user-specific, with search, sort, pagination)
router.get('/', protect, getTasks);

// Update Task (with file update optional)
router.put('/:id', protect, upload.single('file'), updateTask);

// Delete Task
router.delete('/:id', protect, deleteTask);

module.exports = router;