import axios from 'axios';

export const apiCall = axios.create({
    baseURL: `https://tendertownapi.vercel.app`,
    // baseURL: `http://localhost:9000`,
})