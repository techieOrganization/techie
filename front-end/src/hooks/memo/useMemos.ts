import { useState, useEffect, useCallback } from 'react';
import { Memo } from '@/types/memo'; // Memo 타입을 정의해주세요
import { saveMemo, updateMemo, deleteMemo, getMemosByVideo } from '@/app/api/memoAPI';

interface UseMemosProps {
  videoId: string;
}

export const useMemos = ({ videoId }: UseMemosProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMemos, setHasMoreMemos] = useState(true);

  const fetchMemosForVideo = useCallback(
    async (page: number) => {
      try {
        const response = await getMemosByVideo(videoId, page);
        setMemos((prevMemos) =>
          page === 0 ? response.data.content : [...prevMemos, ...response.data.content],
        );

        const isEmptyContent = response.data.empty || response.data.content.length === 0;
        setHasMoreMemos(!isEmptyContent && !response.data.last);
      } catch (error) {
        console.error('Failed to fetch memos for video:', error);
      }
    },
    [videoId],
  );

  useEffect(() => {
    fetchMemosForVideo(currentPage);
  }, [currentPage, fetchMemosForVideo]);

  const addMemo = async (content: string, noteTime: string, videoTitle: string) => {
    try {
      const payload = {
        title: videoTitle,
        content,
        noteTime,
        videoId,
      };
      await saveMemo(payload);
      // 메모 새로고침
      setCurrentPage(0);
      fetchMemosForVideo(0);
    } catch (error) {
      console.error('Failed to save memo:', error);
    }
  };

  const updateMemoById = async (memoId: string, content: string, noteTime: string) => {
    try {
      const payload = {
        noteTime,
        content,
      };
      await updateMemo(memoId, payload);
      // 메모 새로고침
      setCurrentPage(0);
      fetchMemosForVideo(0);
    } catch (error) {
      console.error('Failed to update memo:', error);
    }
  };

  const deleteMemoById = async (memoId: string) => {
    try {
      await deleteMemo(memoId);
      // 메모 새로고침
      setCurrentPage(0);
      fetchMemosForVideo(0);
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };

  return {
    memos,
    hasMoreMemos,
    setCurrentPage,
    addMemo,
    updateMemoById,
    deleteMemoById,
  };
};
