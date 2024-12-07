import axios from 'axios'

const baseURL = `${process.env.REACT_APP_API_URL}/api`

const HeadersWithCredentials = (token = localStorage.getItem('token')) => ({
    'Content-Type': 'application/json',
    Authorization: token,
})

export const axiosInstance = axios.create({
    baseURL,
    headers: HeadersWithCredentials(),
    withCredentials: true,
})
