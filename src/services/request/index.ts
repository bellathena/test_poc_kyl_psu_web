import { baseApi } from "../../libs/axios-config";
import type { GetRequestPaginationByCriteria, CreateRequest, UpdateRequest, DeleteRequest } from "./types/request";
import type { ResultRequestPaginationByCriteria, ResultRequestById } from "./types/response";

export const requestService = {
    async getRequestList(data: GetRequestPaginationByCriteria): Promise<ResultRequestPaginationByCriteria> {
        const response = await baseApi.post<ResultRequestPaginationByCriteria>("/request/list", data)
        return response.data
    },
    async getRequestById(request_number: string): Promise<ResultRequestById> {
        const response = await baseApi.post<ResultRequestPaginationByCriteria>("/request/list", {
            page: 1,
            limit: 1,
            criteria: { search: request_number }
        })
        if (response.data.data.length === 0) {
            throw new Error("Request not found")
        }
        return response.data.data[0]
    },
    async createRequest(data: CreateRequest): Promise<string> {
        const response = await baseApi.post<string>("/request/create", data)
        return response.data
    },
    async updateRequest(data: UpdateRequest): Promise<string> {
        const response = await baseApi.put<string>("/request/update", data)
        return response.data
    },
    async deleteRequest(data: DeleteRequest): Promise<string> {
        const response = await baseApi.delete<string>("/request/delete", { data })
        return response.data
    }
}