import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getAllMemos } from '@/app/api/memoAPI';
import { Memo } from '@/types/memo';
import { devConsoleError } from '@/utils/logger';

const MyMemoSection: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMemos, setHasMoreMemos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMemos = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllMemos(page);
      const newMemos = response.data.content;

      setMemos((prev: Memo[]) => {
        const uniqueMemos = newMemos.filter(
          (memo: Memo) => !prev.some((prevMemo: Memo) => prevMemo.id === memo.id),
        );
        return [...prev, ...uniqueMemos];
      });

      setHasMoreMemos(!response.data.last);
    } catch (error) {
      devConsoleError('Failed to fetch memos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lastMemoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreMemos && !isLoading) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMoreMemos, isLoading],
  );

  useEffect(() => {
    fetchMemos(currentPage);
  }, [currentPage, fetchMemos]);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="memo_section">
      <h2>내 메모 모음</h2>
      {isLoading && <p>메모를 불러오는 중입니다...</p>}
      <div className="memo_list">
        {memos.map((memo: Memo, index: number) => {
          const isLastMemo = index === memos.length - 1;
          const videoUrl = `/playlists/all/${memo.videoId}`;

          return (
            <div
              key={`${memo.id}-${index}`}
              className="memo_item"
              ref={isLastMemo ? lastMemoRef : null}
            >
              <Link href={videoUrl}>
                <h4>{memo.title || ''}</h4>
                <p>{truncateText(memo.content || '', 100)}</p>
                <span>{memo.noteTime}</span>
              </Link>
            </div>
          );
        })}
        {!hasMoreMemos && !isLoading && <p>모든 메모를 불러왔습니다!</p>}
      </div>
    </div>
  );
};

export default MyMemoSection;
