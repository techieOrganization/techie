import React from 'react';
import { Memo } from '@/types/memo';
import { useInfiniteScroll } from '@/hooks/memo/useInfiniteScroll';

interface MemoListProps {
  memos: Memo[];
  hasMoreMemos: boolean;
  loadMoreMemos: () => void;
  onEditMemo: (memo: Memo) => void;
  onDeleteMemo: (memoId: string) => void;
  onTimeClick: (time: string) => void;
}

const MemoList: React.FC<MemoListProps> = ({
  memos,
  hasMoreMemos,
  loadMoreMemos,
  onEditMemo,
  onDeleteMemo,
  onTimeClick,
}) => {
  const { lastElementRef } = useInfiniteScroll({
    hasMore: hasMoreMemos,
    loading: false,
    onLoadMore: loadMoreMemos,
  });

  return (
    <div className="memo_list">
      {memos.length > 0 ? (
        memos.map((memo, index) => {
          const isLastMemo = index === memos.length - 1;
          return (
            <div key={memo.id} className="memo_item" ref={isLastMemo ? lastElementRef : null}>
              <span className="memo_time" onClick={() => onTimeClick(memo.noteTime)}>
                {memo.noteTime || '시간 없음'}
              </span>
              <p className="memo_content">{memo.content || '내용 없음'}</p>
              <div className="memo_actions">
                <button onClick={() => onEditMemo(memo)}>수정</button>
                <button onClick={() => onDeleteMemo(memo.id!)}>삭제</button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="memo_notice">메모가 없습니다. 메모를 추가해보세요!</p>
      )}
    </div>
  );
};

export default MemoList;
