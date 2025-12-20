import { useCallback, useRef, useState } from "react";

export function useDebouncedRefetch(refetchFn, delay = 2000) {
  const [isRefetching, setIsRefetching] = useState(false);
  const timeoutRef = useRef(null);

  const debouncedRefetch = useCallback(async () => {
    if (isRefetching) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsRefetching(true);

    try {
      await refetchFn();
    } finally {
      timeoutRef.current = setTimeout(() => {
        setIsRefetching(false);
      }, delay);
    }
  }, [isRefetching, refetchFn, delay]);

  return { debouncedRefetch, isRefetching };
}
