export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.USER]: "ผู้ใช้ทั่วไป",
    [UserRole.ADMIN]: "ผู้ดูแลระบบ",
};
