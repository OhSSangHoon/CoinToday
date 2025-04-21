import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInfiniteScrollOptions {
  items: any[];
  initialCount?: number;
  incrementCount?: number;
  scrollContainer?: RefObject<HTMLElement>;
  rootMargin?: string;
  threshold?: number;
  activeCondition?: any;
}

// 무한 스크롤 커스텀 훅
export function useInfiniteScroll<T>({
  items,
  initialCount = 5,
  incrementCount = 5,
  scrollContainer,
  rootMargin = '100px',
  threshold = 0.1,
  activeCondition,
}: UseInfiniteScrollOptions) {
  const [displayCount, setDisplayCount] = useState<number>(initialCount);
  const loaderRef = useRef<HTMLDivElement>(null);
  const visibleItems = items.slice(0, displayCount);
  const hasMoreItems = displayCount < items.length;

  useEffect(() => {
    setDisplayCount(initialCount);
  }, [activeCondition, initialCount]);

  useEffect(() => {
    if (items.length === 0 || !hasMoreItems) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 로더 요소가 화면에 보이면 더 많은 아이템 표시
        if (entry.isIntersecting && hasMoreItems) {
          setDisplayCount(prev => Math.min(prev + incrementCount, items.length));
        }
      },
      {
        root: scrollContainer?.current || null,
        rootMargin,
        threshold,
      }
    );

    // 로더 요소 관찰 시작
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // 컴포넌트 언마운트 시 IntersectionObserver 해제
    return () => {
      observer.disconnect();
    };
  }, [
    items.length,
    displayCount,
    hasMoreItems,
    incrementCount,
    scrollContainer,
    rootMargin,
    threshold
  ]);

  // 초기 로드 시 컨텐츠가 적으면 자동으로 더 불러오기
  useEffect(() => {
    // 처음 로드된 후 스크롤이 생기지 않는다면 자동으로 더 불러오기
    const handleInitialLoad = () => {
      if (document.body.scrollHeight <= window.innerHeight && hasMoreItems) {
        setDisplayCount(prev => Math.min(prev + incrementCount, items.length));
      }
    };

    handleInitialLoad();

    // 윈도우 크기 변경 시에도 체크
    window.addEventListener('resize', handleInitialLoad);
    return () => window.removeEventListener('resize', handleInitialLoad);
  }, [items.length, hasMoreItems, incrementCount, activeCondition]);

  // 로딩 요소 렌더링 함수
  const renderLoader = () => {
    return (
      <div
        ref={loaderRef}
        className={`py-6 flex justify-center items-center ${hasMoreItems ? 'opacity-100' : 'opacity-0'}`}
      >
        {hasMoreItems ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : null}
      </div>
    );
  };

  return {
    visibleItems,
    hasMoreItems,
    loaderRef,
    renderLoader,
    displayCount,
    setDisplayCount
  };
}