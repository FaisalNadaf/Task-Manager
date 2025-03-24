import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Tasks.css';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const tasksPerPage = 5;
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');


    const fetchTasks = useCallback(async () => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://task-manager-zetw.onrender.com/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setTasks(response.data.tasks);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Failed to fetch tasks. Please login again.');
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    }, [navigate]);
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async () => {
        if (!['Low', 'Medium', 'High'].includes(priority)) {
            alert('Select a valid priority');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('priority', priority);
            if (file) formData.append('file', file);

            const res = await axios.post('https://task-manager-zetw.onrender.com/api/tasks', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            console.log('Task added:', res.data);
            fetchTasks();  // Refresh tasks
        } catch (err) {
            console.log('Add Task Error:', err);
            alert(err.response?.data?.message || 'Error while adding the task');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`https://task-manager-zetw.onrender.com/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Deleted Task:', res.data);
            fetchTasks(); // Refresh tasks after delete
        } catch (err) {
            console.error('Delete Task Error:', err);
            alert('Failed to delete the task.');
        }
    };

    // Complete Task
    const handleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `https://task-manager-zetw.onrender.com/api/tasks/${id}`,
                { completed: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Marked Completed:', res.data);
            fetchTasks();
        } catch (err) {
            console.error('Complete Task Error:', err);
            alert('Failed to mark task as completed.');
        }
    };


    const handleLogout = async () => {
        try {
            await axios.post('https://task-manager-zetw.onrender.com/api/auth/logout', {}, { withCredentials: true });
            navigate('/');
        } catch (err) {
            console.error('Logout Error:', err);
            setError('Logout failed');
        }
    };

    const filteredTasks = tasks
        .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sortOrder === 'asc' ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority));

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="tasks-container">
            <header>
                <h2>Task Manager</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleAddTask} className="task-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="controls">
                <input
                    type="text"
                    placeholder="Search Tasks"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Sort by Priority ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
                </button>
            </div>

            <ul className="task-list">
                {currentTasks.map((task) => (
                    <li key={task._id} className={task.completed ? 'completed' : ''}>
                        <strong>{task.title}</strong> - {task.description} ({task.priority})
                        <div>
                            {!task.completed && (
                                <button onClick={() => handleComplete(task._id)}>Complete</button>
                            )}
                            <button onClick={() => handleDelete(task._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <footer>© 2025 Task Manager App</footer>
        </div>
    );
};

export default Tasks;
