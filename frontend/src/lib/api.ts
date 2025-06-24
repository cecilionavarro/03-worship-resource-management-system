import API from "@/config/apiClient";

interface LoginData {
    email: string,
    password: string,
}
export const login = async (data: LoginData) => API.post("/auth/login", data);
