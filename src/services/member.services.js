import { axiosInstance } from './api'

const prefix = '/member'

export const getAll = async () => await axiosInstance.get(prefix)

export const create = async ({ firstName, lastName, gender }) =>
    await axiosInstance.post(prefix, { firstName, lastName, gender })

export const edit = async ({ uid, firstName, lastName, gender }) =>
    await axiosInstance.patch(`${prefix}/${uid}`, { firstName, lastName, gender })
