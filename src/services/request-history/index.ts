import { baseApi } from "../../libs/axios-config";
import type { StatusHistoryItem } from "./types/response";

export const requestHistoryService = {
    async getRequestHistory(request_id: string): Promise<StatusHistoryItem[]> {
        const response = await baseApi.get<StatusHistoryItem[]>(`/request/${request_id}/history`);
        return response.data;
    },
};
