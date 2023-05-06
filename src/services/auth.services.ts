import axios from "axios"

import { url, HeadersWithCredentials } from "./api"

const prefix = `${url}/users`

export const login = async (email: string, password: string) => {
    return await axios.post(
        `${prefix}/connect`,
        { email, password },
        {
            headers: HeadersWithCredentials(),
        }
    )
}

export const signup = async (email: string, password: string) => {
    return await axios.post(
        `${prefix}/signup`,
        { email, password },
        {
            headers: HeadersWithCredentials(),
        }
    )
}
