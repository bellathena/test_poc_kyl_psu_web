import type { UserRole } from "../../../const/enum/user-role";

export type AuthUser = {
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    role: UserRole;
};

export type LoginResponse = {
    access_token: string;
    user: AuthUser;
};

export type RegisterResponse = {
    user_id: string;
    username: string;
    role: UserRole;
};

export type GetMeResponse = {
    user_id: string;
    username: string;
    role: UserRole;
};
