import API from "@/config/apiClient";

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

export const login = async (data: LoginData) => API.post("/auth/login", data);
export const logout = async () => API.get("/auth/logout");
export const register = async (data: RegisterData) =>
  API.post("/auth/register", data);
export const verifyEmail = async (verificationCode: string) =>
  API.get(`/auth/email/verify/${verificationCode}`);
export const sendPasswordResetEmail = async (email: string) =>
  API.post(`/auth/password/forgot`, { email });
export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordData) =>
  API.post(`/auth/password/reset`, { verificationCode, password });

export const getUser = async () => API.get("/user");
export const getSessions = async () => API.get("/sessions");
