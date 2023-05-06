const { VITE_DATABASE } = import.meta.env

export const url = `${VITE_DATABASE}/api`

export const HeadersWithCredentials = (token = localStorage.getItem("token")) => ({
    "Access-Control-Allow-Origin": VITE_DATABASE,
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
    Authorization: token,
    withCredentials: true,
})
