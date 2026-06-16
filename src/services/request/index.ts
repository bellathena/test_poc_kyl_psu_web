import { baseApi } from "../../libs/axios-config";
import type { GetRequestPaginationByCriteria, CreateRequest, UpdateRequest, DeleteRequest, AdminUpdateStatusRequest } from "./types/request";
import type { ResultRequestPaginationByCriteria, ResultRequestById } from "./types/response";
import type { AdminUpdateStatusResponse } from "./types/request";

export const requestService = {
    async getRequestList(data: GetRequestPaginationByCriteria): Promise<ResultRequestPaginationByCriteria> {
        const response = await baseApi.post<ResultRequestPaginationByCriteria>("/request/list", data)
        return response.data
    },
    async getRequestById(request_id: string): Promise<ResultRequestById> {
        const response = await baseApi.get<ResultRequestById>(`/request/${request_id}`)
        return response.data
    },
    async createRequest(data: CreateRequest): Promise<string> {
        const response = await baseApi.post<string>("/request/create", data)
        return response.data
    },
    async updateRequest(data: UpdateRequest): Promise<string> {
        const response = await baseApi.post<string>("/request/update", data)
        return response.data
    },
    async deleteRequest(data: DeleteRequest): Promise<string> {
        const response = await baseApi.post<string>("/request/delete", data)
        return response.data
    },
    async adminUpdateStatus(data: AdminUpdateStatusRequest): Promise<AdminUpdateStatusResponse> {
        const response = await baseApi.post<AdminUpdateStatusResponse>("/request/admin/update-status", data)
        return response.data
    },
}
