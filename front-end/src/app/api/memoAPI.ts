import apiClient from '@/components/axios/apiClient';

interface MemoPayload {
  title?: string;
  content: string;
  noteTime: string;
  videoId?: string;
}

// 메모 저장
export const saveMemo = (payload: MemoPayload) => {
  return apiClient.post('/memo', payload);
};

// 메모 수정
export const updateMemo = (memoId: string, payload: { noteTime: string; content: string }) => {
  return apiClient.put(`/memo/${memoId}`, payload);
};

// 메모 삭제
export const deleteMemo = (memoId: string) => {
  return apiClient.delete(`/memo/${memoId}`);
};

// 메모 단건 조회
export const getMemo = (memoId: string) => {
  return apiClient.get(`/memo/${memoId}`);
};

// 모든 메모 가져오기 (페이지네이션 지원)
export const getAllMemos = (page: number = 1) => {
  return apiClient.get('/memo/list', {
    params: { page },
  });
};

// 특정 동영상에 대한 메모 가져오기
export const getMemosByVideo = (videoId: string, page: number = 1) => {
  console.log('Requesting memos for videoId:', videoId);

  return apiClient.get('/memo/byVideo', {
    params: {
      vId: videoId, // API 요청 시 동영상 ID 전달
      page, // 페이지 번호 전달
    },
  });
};
