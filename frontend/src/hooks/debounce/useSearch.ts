"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

interface SearchParams {
  url: string;
  page?: number;
  limit?: number;
  delay?: number;
}

export function useSearch<T>({
  url,
  page = 1,
  limit = 10,
  delay = 500,
}: SearchParams) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const res = await fetch(
          `${url}?search=${debouncedQuery}&page=${page}&limit=${limit}`,
        );

        const result = await res.json();

        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [debouncedQuery, page, limit, url]);

  return {
    query,
    setQuery,
    data,
    loading,
  };
}
