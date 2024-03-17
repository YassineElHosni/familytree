import { UserType } from "./user.types"

export type AuthContextType = {
    isLoggedIn: boolean
    isLoading: boolean
    user: UserType
    login: (email: string, password: string) => void
    signup: (email: string, password: string, username: string) => void
    logout: () => void
}
