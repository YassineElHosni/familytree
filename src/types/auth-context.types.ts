export type AuthContextType = {
    isLoggedIn: boolean
    isLoading: boolean
    login: (email: string, password: string) => void
    signup: (email: string, password: string, username: string) => void
    logout: () => void
}
