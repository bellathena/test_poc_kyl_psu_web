import type { RequestTable } from "../../../types/api/request-table"
import { RequestType } from "../../../const/enum/request-type"

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