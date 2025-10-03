import API from "@/config/apiClient";

export type User = {
    _id: string;
    email: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
};

export type Session = {
    _id: string;
    userAgent: string;
    createdAt: string;
    isCurrent: boolean;
};

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
}

interface ResetPasswordData {
    verificationCode: string;
    password: string;
}

export const login = (data: LoginData) => API.post("/auth/login", data);
export const logout = () => API.get("/auth/logout");
export const register = (data: RegisterData) =>
    API.post("/auth/register", data);
export const verifyEmail = (verificationCode: string) =>
    API.get(`/auth/email/verify/${verificationCode}`);
export const sendPasswordResetEmail = (email: string) =>
    API.post(`/auth/password/forgot`, { email });
export const resetPassword = ({
    verificationCode,
    password,
}: ResetPasswordData) =>
    API.post(`/auth/password/reset`, { verificationCode, password });

export const getUser = () => API.get<User, User>("/user");

export const getSessions = () => API.get<Session[], Session[]>("/sessions");

export const deleteSessions = (id: Session["_id"]) =>
    API.delete(`/sessions/${id}`);
