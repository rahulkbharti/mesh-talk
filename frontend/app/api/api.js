import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8001/', // Replace with your actual base URL
    withCredentials: true,
    timeout: 55000,
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
});

// Fetch posts from API
export const fetchPosts = async () => {
    const response = await axiosInstance.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
};
