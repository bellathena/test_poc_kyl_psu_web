import { baseApi } from "../../libs/axios-config";
import type { LoginRequest, RegisterRequest } from "./types/request";
import type { LoginResponse, RegisterResponse, GetMeResponse } from "./types/response";

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await baseApi.post<LoginResponse>("/auth/login", data);
        return response.data;
    },
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await baseApi.post<RegisterResponse>("/auth/register", data);
        return response.data;
    },
    async getMe(): Promise<GetMeResponse> {
        const response = await baseApi.get<GetMeResponse>("/auth/me");
        return response.data;
    },
};
