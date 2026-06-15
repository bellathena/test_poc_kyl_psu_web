import { useState, useEffect, useRef } from "react";
import { requestService } from "../../../../../services/request";
import type { RequestItem } from "../../../../../services/request/types/response";

interface UseLoadRequestDataReturn {
  data: RequestItem | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLoadRequestData = (request_number?: string): UseLoadRequestDataReturn => {
  const [data, setData] = useState<RequestItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    if (!request_number) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const result = await requestService.getRequestById(request_number);

      if (!controller.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load request");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (request_number) {
      fetchData();
    }
    return () => {
      abortRef.current?.abort();
    };
  }, [request_number]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
