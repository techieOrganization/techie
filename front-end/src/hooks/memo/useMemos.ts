import { useState, useEffect, useCallback } from 'react';
import { Memo } from '@/types/memo';
import { saveMemo, updateMemo, deleteMemo, getMemosByVideo } from '@/app/api/memoAPI';

interface UseMemosProps {
  videoId: string;
  isLoggedIn: boolean;
}

export const useMemos = ({ videoId, isLoggedIn }: UseMemosProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMemos, setHasMoreMemos] = useState(true);

  const fetchMemosForVideo = useCallback(
    async (page: number) => {
      if (!isLoggedIn) {
        setMemos([]);
        setHasMoreMemos(false);
        return;
      }

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
    [videoId, isLoggedIn],
  );

  useEffect(() => {
    fetchMemosForVideo(currentPage);
  }, [currentPage, fetchMemosForVideo]);

  const addMemo = async (title: string, content: string, noteTime: string) => {
    if (!isLoggedIn) {
      console.warn('로그인하지 않은 상태에서는 메모를 추가할 수 없습니다.');
      return; // Do not proceed if not logged in
    }

    try {
      const payload = {
        title,
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

  const updateMemoById = async (
    memoId: string,
    title: string,
    content: string,
    noteTime: string,
  ) => {
    if (!isLoggedIn) {
      console.warn('로그인하지 않은 상태에서는 메모를 수정할 수 없습니다.');
      return;
    }

    try {
      const payload = {
        title,
        content,
        noteTime,
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
    if (!isLoggedIn) {
      console.warn('로그인하지 않은 상태에서는 메모를 삭제할 수 없습니다.');
      return;
    }

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
