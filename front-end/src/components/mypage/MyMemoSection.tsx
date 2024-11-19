'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllMemos } from '@/app/api/memoAPI';

interface Memo {
  id: string;
  title?: string;
  content: string;
  noteTime: string;
  videoId?: string;
}

const MyMemoSection: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMemos, setHasMoreMemos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // 메모 데이터를 가져오는 함수
  const fetchMemos = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllMemos(page);
      console.log('Fetched memos:', response.data.content);
      const newMemos = response.data.content;

      setMemos((prev) => [...prev, ...newMemos]);
      setHasMoreMemos(!response.data.last);
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 페이지네이션
  const lastMemoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreMemos) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMoreMemos],
  );

  useEffect(() => {
    fetchMemos(currentPage);
  }, [currentPage, fetchMemos]);

  return (
    <div className="memo_section">
      <h2>내 메모 모음</h2>
      {isLoading && <p>메모를 불러오는 중입니다...</p>}
      <div className="memo_list">
        {memos.map((memo, index) => {
          const isLastMemo = index === memos.length - 1;

          return (
            <div key={memo.id} className="memo_item" ref={isLastMemo ? lastMemoRef : null}>
              <h4>{memo.title || '제목 없음'}</h4>
              <p>{memo.content}</p>
              <span>{memo.noteTime}</span>
            </div>
          );
        })}
        {!hasMoreMemos && !isLoading && <p>모든 메모를 불러왔습니다!</p>}
      </div>
    </div>
  );
};

export default MyMemoSection;
