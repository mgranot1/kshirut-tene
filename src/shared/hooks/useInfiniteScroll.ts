import { useCallback, useEffect, useState } from "react";
import useOnScreenDynamically from "./useOnScreenDynamically";

export const useInfiniteScroll = (cb: () => Promise<boolean>) => {
  const [hasMore, setHasMore] = useState(false);

  const { isIntersecting, elementRef } = useOnScreenDynamically(hasMore);

  const fetchMore = useCallback(async () => {
    const hasMoreToFetch = await cb();
    setHasMore(hasMoreToFetch);
  }, [cb]);

  useEffect(() => {
    setHasMore(false);
    fetchMore();
  }, [fetchMore]);

  useEffect(() => {
    isIntersecting && hasMore && fetchMore();
  }, [isIntersecting, hasMore]);

  return { hasMore, lastCardRef: elementRef };
};
