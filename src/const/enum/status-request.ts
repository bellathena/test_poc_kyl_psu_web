export const StatusRequest = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED",
} as const;

export type StatusRequest = (typeof StatusRequest)[keyof typeof StatusRequest];

export const STATUS_REQUEST_LABELS: Record<StatusRequest, string> = {
    [StatusRequest.PENDING]: "รอดำเนินการ",
    [StatusRequest.IN_PROGRESS]: "กำลังดำเนินการ",
    [StatusRequest.RESOLVED]: "เสร็จสิ้น",
    [StatusRequest.REJECTED]: "ปฏิเสธ",
};

export const STATUS_REQUEST_COLORS: Record<StatusRequest, string> = {
    [StatusRequest.PENDING]: "default",
    [StatusRequest.IN_PROGRESS]: "processing",
    [StatusRequest.RESOLVED]: "success",
    [StatusRequest.REJECTED]: "error",
};
