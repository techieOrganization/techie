import { useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean; // 로딩 중인지 여부
  hasMore: boolean; // 더 로드할 데이터가 있는지 여부
  onLoadMore: () => void; // 추가 데이터를 로드하는 함수
  threshold?: number; // 옵저버 임계값
}

const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions): ((node: HTMLElement | null) => void) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = (node: HTMLElement | null) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold },
    );

    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return lastElementRef;
};

export default useInfiniteScroll;
