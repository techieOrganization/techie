'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllMemos } from '@/app/api/memoAPI';
import { Memo } from '@/types/memo';

const MyMemoSection: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 페이지 0부터 시작
  const [hasMoreMemos, setHasMoreMemos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  const fetchMemos = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllMemos(page);
      const newMemos = response.data.content; // 데이터 확인 필요
      setMemos((prev) => [...prev, ...newMemos]);
      setHasMoreMemos(!response.data.last);
    } catch (error) {
      console.error('Failed to fetch memos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
          const videoUrl = `/playlists/all/${memo.videoId}`;

          return (
            <div key={memo.id} className="memo_item" ref={isLastMemo ? lastMemoRef : null}>
              <a
                href={videoUrl}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(videoUrl);
                }}
                style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <h4>{memo.title || '제목 없음'}</h4>
                <p>{memo.content}</p>
                <span>{memo.noteTime}</span>
              </a>
            </div>
          );
        })}
        {!hasMoreMemos && !isLoading && <p>모든 메모를 불러왔습니다!</p>}
      </div>
    </div>
  );
};

export default MyMemoSection;
