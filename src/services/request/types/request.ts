import type { RequestTable } from "../../../types/api/request-table"
import { RequestType } from "../../../const/enum/request-type"
import type { StatusRequest } from "../../../const/enum/status-request"

export type GetRequestPaginationByCriteria = RequestTable<{
    search?: string
    request_type?: RequestType
}>

export type CreateRequest = {
    title: string,
    request_type: RequestType,
    requester_name: string,
    requester_email: string,
    detail: string,
}

export type UpdateRequest = {
    request_id: string,
    title: string,
    request_type: RequestType,
    requester_name: string,
    requester_email: string,
    detail: string,
}

export type DeleteRequest = {
    request_id: string
}

export type AdminUpdateStatusRequest = {
    request_id: string
    new_status: StatusRequest
    admin_response?: string
}

export type AdminUpdateStatusResponse = {
    request_id: string
    old_status: StatusRequest
    new_status: StatusRequest
    admin_response: string | null
}
