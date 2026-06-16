import type { ResponseTable } from "../../../types/api/response-table"
import type { StatusRequest } from "../../../const/enum/status-request"

export type RequestItem = {
    request_id: string;
    request_number: string;
    title: string;
    request_type: string;
    requester_name: string;
    requester_email: string;
    detail?: string;
    status: StatusRequest;
    admin_response: string | null;
    is_delete: boolean;
    created_at: string;
    updated_at: string;
    created_by: string | null;
}

export type ResultRequestPaginationByCriteria = ResponseTable<RequestItem>

export type ResultRequestById = RequestItem
