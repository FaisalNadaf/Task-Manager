import axios from 'axios';

const api = axios.create({
    baseURL: 'https://task-manager-zetw.onrender.com/api',
    withCredentials: true,
});
axios.defaults.withCredentials = true;
axios.get('https://task-manager-zetw.onrender.com/api/tasks', { withCredentials: true });
axios.post('https://task-manager-zetw.onrender.com/api/tasks', {withCredentials: true});



export default api;
