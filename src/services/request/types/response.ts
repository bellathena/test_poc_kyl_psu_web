import type { ResponseTable } from "../../../types/api/response-table"

export type RequestItem = {
    request_id: string;
    request_number: string;
    title: string;
    request_type: string;
    requester_name: string;
    requester_email: string;
    created_at: string;
    detail?: string;
}

export type ResultRequestPaginationByCriteria = ResponseTable<RequestItem>

export type ResultRequestById = RequestItem