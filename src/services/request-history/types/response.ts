import type { StatusRequest } from "../../../const/enum/status-request";

export type StatusHistoryItem = {
    history_id: string;
    request_id: string;
    old_status: StatusRequest;
    new_status: StatusRequest;
    remark: string | null;
    changed_by: string;
    created_at: string;
};
