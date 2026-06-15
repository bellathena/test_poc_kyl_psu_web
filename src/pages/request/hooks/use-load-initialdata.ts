import { useState, useEffect, useRef } from "react";
import { requestService } from "../../../services/request";
import type { ResultRequestPaginationByCriteria, RequestItem } from "../../../services/request/types/response";
import type { RequestType } from "../../../const/enum/request-type";

interface UseLoadInitialDataParams {
  page: number;
  limit: number;
  search?: string;
  request_type?: RequestType;
}

interface UseLoadInitialDataReturn {
  data: RequestItem[];
  totalCount: number;
  totalPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLoadInitialData = ({
  page = 1,
  limit = 10,
  search = "",
  request_type,
}: UseLoadInitialDataParams): UseLoadInitialDataReturn => {
  const [data, setData] = useState<RequestItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const response: ResultRequestPaginationByCriteria = await requestService.getRequestList({
        page,
        limit,
        criteria: {
          search,
          request_type,
        },
      });

      if (!controller.signal.aborted) {
        setData(response.data);
        setTotalCount(response.pagination.total_count);
        setTotalPage(response.pagination.total_page);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading request list:", err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      abortRef.current?.abort();
    };
  }, [page, limit, search, request_type]);

  return {
    data,
    totalCount,
    totalPage,
    isLoading,
    error,
    refetch: fetchData,
  };
};
